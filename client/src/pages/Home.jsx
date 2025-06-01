import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [role, setRole] = useState('sponsor');

  const handleSignup = () => {
    navigate(`/signup?role=${role}`);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="homepage-container">
      <div className="logo-text">
        <span className="sponsor">Sponsor</span><span className="me">Me</span>
      </div>
      <p className="tagline">Connecting Sponsors and Creators</p>

      <div className="role-toggle">
        <button className={role === 'sponsor' ? 'active' : ''} onClick={() => setRole('sponsor')}>Sponsor</button>
        <button className={role === 'sponsee' ? 'active' : ''} onClick={() => setRole('sponsee')}>Sponsee</button>
      </div>

      <button className="signup-btn" onClick={handleSignup}>Sign Up</button>

      <p className="login-link" onClick={handleLogin}>Log in</p>
    </div>
  );
}

export default Home;
