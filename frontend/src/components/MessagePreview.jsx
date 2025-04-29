import React from 'react';

const MessagePreview = ({ messages, error }) => {
  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (messages.length === 0) {
    return <p>No recent messages.</p>;
  }

  return (
    <div className="card-list">
      {messages.map((msg, idx) => (
        <div className="card" key={idx}>
          <div>
            <strong>{msg.senderName || 'Sender Name'}</strong>
            <p>{msg.snippet || 'Message snippet goes here.'}</p>
          </div>
          <span style={{ color: '#aaa' }}>{msg.timestamp || '2h ago'}</span>
        </div>
      ))}
    </div>
  );
};

export default MessagePreview;
