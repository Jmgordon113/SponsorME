import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    axios.get('/api/messages/conversations/' + localStorage.getItem('userId')).then(res => setConversations(res.data));
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !selected) return;
    const res = await axios.post('/api/messages', {
      receiverId: selected.user._id,
      text: input,
      opportunityId: selected.messages[0]?.opportunityId?._id || null,
    });
    setSelected({
      ...selected,
      messages: [...selected.messages, res.data],
    });
    setInput('');
  };

  return (
    <div className="messages-container">
      <div className="conversation-list">
        <h3>Conversations</h3>
        {conversations.map(conv => (
          <div
            key={conv.user._id}
            className={`conversation-item${selected?.user._id === conv.user._id ? ' active' : ''}`}
            onClick={() => setSelected(conv)}
          >
            {conv.user.name}
          </div>
        ))}
      </div>
      <div className="chat-panel">
        {selected ? (
          <>
            <div className="chat-history">
              {selected.messages.map(msg => (
                <div
                  key={msg._id}
                  className={`chat-bubble${msg.sender._id === selected.user._id ? ' incoming' : ' outgoing'}`}
                >
                  <p>{msg.text}</p>
                  <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
            <div className="message-input">
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </>
        ) : (
          <p>Select a conversation to view messages.</p>
        )}
      </div>
    </div>
  );
}

export default Messages;
