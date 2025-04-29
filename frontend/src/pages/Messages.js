import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; // Use the configured axios instance
import './Messages.css';
import LogoutButton from '../components/LogoutButton'; // Import LogoutButton

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/messages/preview', {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  const fetchMessages = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
      setSelectedUserId(userId);
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError('Failed to load messages. Please try again later.');
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        '/api/messages',
        {
          recipientId: selectedUserId,
          content: inputMessage,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages([...messages, res.data.data]);
      setInputMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again later.');
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
        <LogoutButton /> {/* Add LogoutButton */}
      </div>
      <div className="conversation-list">
        <h3>Messages</h3>
        {conversations.map((user, index) => (
          <div
            key={index}
            className={`conversation-item ${user._id === selectedUserId ? 'active' : ''}`}
            onClick={() => fetchMessages(user._id)}
          >
            {user.name}
          </div>
        ))}
      </div>

      <div className="chat-panel">
        {selectedUserId ? (
          <>
            <div className="chat-history">
              {messages.map((msg, idx) => (
                <div key={idx} className={`chat-bubble ${msg.sender._id === selectedUserId ? 'incoming' : 'outgoing'}`}>
                  <p>{msg.content}</p>
                  <span className="timestamp">{new Date(msg.createdAt).toLocaleTimeString()}</span>
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
          <div className="chat-placeholder">Select a conversation to start chatting.</div>
        )}
      </div>
    </div>
  );
};

export default Messages;
