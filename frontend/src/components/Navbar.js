import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton'; // Import LogoutButton
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <span className="logo-sponsor">Sponsor</span>
          <span className="logo-me">Me</span>
        </Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/feed">Feed</Link></li>
        <li><Link to="/dashboard-sponsor">Dashboard</Link></li>
        <li><Link to="/signup" className="cta">Sign Up</Link></li>
        <li><LogoutButton /> {/* Add LogoutButton */}</li>
      </ul>
    </nav>
  );
}

export default Navbar;
