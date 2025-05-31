import React from 'react';

function MessagePreview({ messages, error }) {
  return (
    <div>
      {error && <p className="error-msg">{error}</p>}
      {messages && messages.length > 0 ? (
        <ul>
          {messages.map((message) => (
            <li key={message._id}>{message.text}</li>
          ))}
        </ul>
      ) : (
        <p>No messages to display.</p>
      )}
    </div>
  );
}

export default MessagePreview;
