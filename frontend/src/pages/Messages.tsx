import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { io } from 'socket.io-client';
import './Messages.css';

const socket = io('http://localhost:5001', {
  transports: ['websocket'],
  withCredentials: true,
});

interface Message {
  _id: string;
  sender: { _id: string; name: string };
  receiver: { _id: string; name: string };
  text: string;
  timestamp: string;
  opportunityId?: { _id: string; title: string };
}

interface Conversation {
  user: { _id: string; name: string };
  messages: Message[];
}

const Messages: React.FC = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      setError('You must be logged in to view messages.');
      setIsLoading(false);
      return;
    }

    const fetchConversations = async () => {
      try {
        const res = await axios.get('/api/messages/conversations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConversations(res.data);
      } catch (err) {
        setError('Failed to load conversations. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();

    socket.emit('join', userId);
    socket.on('receive-message', (msg: Message) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.user._id === msg.sender._id || conv.user._id === msg.receiver._id
            ? { ...conv, messages: [...conv.messages, msg] }
            : conv
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedConversation) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        '/api/messages',
        {
          receiverId: selectedConversation.user._id,
          text: inputMessage,
          opportunityId: selectedConversation.messages[0]?.opportunityId?._id || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedConversation({
        ...selectedConversation,
        messages: [...selectedConversation.messages, res.data],
      });
      setInputMessage('');
      socket.emit('send-message', { receiverId: selectedConversation.user._id, message: res.data });
    } catch (err) {
      alert('Failed to send message. Please try again.');
    }
  };

  if (isLoading) return <p>Loading messages...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="messages-container">
      <div className="conversation-list">
        <h3>Conversations</h3>
        {conversations.length > 0 ? (
          conversations.map((conversation) => (
            <div
              key={conversation.user._id}
              className={`conversation-item ${
                selectedConversation?.user._id === conversation.user._id ? 'active' : ''
              }`}
              onClick={() => setSelectedConversation(conversation)}
            >
              {conversation.user.name}
            </div>
          ))
        ) : (
          <p>No conversations yet.</p>
        )}
      </div>
      <div className="chat-panel">
        {selectedConversation ? (
          <>
            <div className="chat-history">
              {selectedConversation.messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`chat-bubble ${
                    msg.sender._id === selectedConversation.user._id ? 'incoming' : 'outgoing'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.opportunityId && <p>Regarding: {msg.opportunityId.title}</p>}
                  <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
            <div className="message-input">
              <input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <p>Select a conversation to view messages.</p>
        )}
      </div>
    </div>
  );
};

export default Messages;
