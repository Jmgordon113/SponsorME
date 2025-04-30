import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig'; // Use the configured axios instance
import { io } from 'socket.io-client';
import './Messages.css';
import LogoutButton from '../components/LogoutButton';

const socket = io('http://localhost:5001');

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get('/api/messages/conversations'); // Fetch all conversations
        setConversations(res.data);
      } catch (err) {
        console.error('Failed to load conversations:', err);
        setError('Failed to load conversations. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    const currentUserId = localStorage.getItem('userId');
    socket.emit('join', currentUserId);

    socket.on('receive-message', (msg) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.user._id === msg.sender || conv.user._id === msg.receiver
            ? { ...conv, messages: [...conv.messages, msg] }
            : conv
        )
      );
    });

    return () => socket.disconnect();
  }, []);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    try {
      const res = await axios.post('/api/messages', {
        receiverId: selectedConversation.user._id,
        text: inputMessage,
        opportunityId: selectedConversation.messages[0]?.opportunityId?._id || null,
      });
      setSelectedConversation({
        ...selectedConversation,
        messages: [...selectedConversation.messages, res.data],
      });
      setInputMessage('');
      socket.emit('send-message', { receiverId: selectedConversation.user._id, message: res.data });
    } catch (err) {
      if (err.response?.status === 403) {
        alert('You can only message a sponsor who contacted you first.');
      } else {
        console.error('Failed to send message:', err);
        alert('Failed to send message. Please try again.');
      }
    }
  };

  if (isLoading) {
    return <p>Loading messages...</p>;
  }

  if (error) {
    return <p className="error-msg">{error}</p>;
  }

  return (
    <div className="messages-container">
      <div className="messages-header-container">
        <h1>Inbox</h1>
        <LogoutButton />
      </div>
      <div className="conversation-list">
        <h3>Conversations</h3>
        {conversations.length > 0 ? (
          conversations.map((conversation) => (
            <div
              key={conversation.user._id}
              className={`conversation-item ${
                selectedConversation?.user._id === conversation.user._id ? 'active' : ''
              }`}
              onClick={() => handleSelectConversation(conversation)}
            >
              {conversation.user.name}
              {conversation.messages[0]?.opportunityId && (
                <p style={{ fontSize: '0.85rem', color: '#555' }}>
                  Regarding: {conversation.messages[0].opportunityId.title}
                </p>
              )}
            </div>
          ))
        ) : (
          <p>No conversations found.</p>
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
                  {msg.opportunityId && (
                    <p style={{ fontSize: '0.85rem', color: '#555' }}>
                      Regarding: {msg.opportunityId.title}
                    </p>
                  )}
                  <span className="timestamp">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
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
              <button onClick={sendMessage}>Send</button>
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
