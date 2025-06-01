import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };
  return (
    <button onClick={handleLogout} style={{ marginLeft: 16 }}>
      Logout
    </button>
  );
}

export default LogoutButton;
