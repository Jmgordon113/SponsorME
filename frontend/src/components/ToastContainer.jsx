import React, { useEffect, useState } from 'react';
import './ToastContainer.css';

const ToastContainer = ({ message, duration = 3000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer); // Cleanup
  }, [duration]);

  if (!visible || !message) return null;

  return (
    <div className="toast-container">
      <div className="toast-message">
        {message}
        <button className="toast-close-btn" onClick={() => setVisible(false)}>✖</button>
      </div>
    </div>
  );
};

export default ToastContainer;
