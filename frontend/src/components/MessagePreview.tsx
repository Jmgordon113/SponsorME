import React from 'react';

type Message = {
  _id: string;
  text: string;
  // ...other fields as needed
};

type MessagePreviewProps = {
  messages: Message[];
  error?: string;
};

const MessagePreview: React.FC<MessagePreviewProps> = ({ messages, error }) => {
  return (
    <div>
      {error && <p className="error-msg">{error}</p>}
      {messages.length > 0 ? (
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
};

export default MessagePreview;