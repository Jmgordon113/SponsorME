import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import API from '../utils/axiosConfig'; // Use the configured Axios instance
import jwt_decode from 'jwt-decode';
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
  const location = useLocation(); // Use useLocation to retrieve state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // Load token and userId from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('You must be logged in to view messages.');
      navigate('/login');
      return;
    }

    try {
      const decoded: { userId: string; exp: number; role: string } = jwt_decode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setError('Your session has expired. Please log in again.');
        navigate('/login');
        return;
      }

      setUserId(decoded.userId);
      setRole(decoded.role);
    } catch (err) {
      console.error('Invalid token:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      setError('Invalid session. Please log in again.');
      navigate('/login');
      return;
    }

    const fetchConversations = async () => {
      try {
        // Use the user's ID in the API call
        const res = await API.get(`/api/messages/conversations/${userId}`);
        // Sort by most recent message
        const sorted = [...res.data].sort((a, b) => {
          const aTime = new Date(a.messages[a.messages.length - 1]?.createdAt).getTime();
          const bTime = new Date(b.messages[b.messages.length - 1]?.createdAt).getTime();
          return bTime - aTime;
        });
        setConversations(sorted);

        // Auto-select conversation if selectedUserId is passed in state
        const { selectedUserId } = location.state || {};
        if (selectedUserId) {
          const conv = res.data.find((c: Conversation) => c.user._id === selectedUserId);
          if (conv) setSelectedConversation(conv);
        }
      } catch (err: any) {
        console.error('Failed to load messages:', err?.response?.data || err.message);
        setError('Failed to load conversations. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) fetchConversations();

    socket.emit('join', userId);

    socket.on('receive-message', (msg: Message) => {
      const partnerId = msg.sender._id !== userId ? msg.sender._id : msg.receiver._id;
      const exists = conversations.some((c) => c.user._id === partnerId);
      if (!exists) {
        setConversations((prev) => [...prev, { user: msg.sender, messages: [msg] }]);
      }
      setConversations((prev) =>
        prev.map((conv) =>
          conv.user._id === msg.sender._id || conv.user._id === msg.receiver._id
            ? { ...conv, messages: [...conv.messages, msg] }
            : conv
        )
      );
    });

    return () => {
      socket.disconnect(); // Disconnect only when component unmounts
    };
  }, [navigate, location.state, userId]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedConversation) return;
    if (role !== 'sponsor') {
      alert('Only sponsors can initiate messages.');
      return;
    }

    try {
      const res = await API.post('/api/messages', {
        receiverId: selectedConversation.user._id,
        text: inputMessage,
        opportunityId: selectedConversation.messages[0]?.opportunityId?._id || null,
      });

      setSelectedConversation({
        ...selectedConversation,
        messages: [...selectedConversation.messages, res.data],
      });
      setInputMessage('');
      socket.emit('send-message', {
        receiverId: selectedConversation.user._id,
        message: res.data,
      });
    } catch (err: any) {
      alert('Failed to send message. Please try again.');
    }
  };

  if (error) return <p className="error-msg">{error}</p>;
  if (isLoading) return <p>Loading messages...</p>;

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