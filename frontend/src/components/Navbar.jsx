import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton'; // adjust path as needed
import './Navbar.css';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const dashboardPath = role === 'sponsee' ? '/dashboard-sponsee' : '/dashboard-sponsor';

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
        {token && <li><Link to={dashboardPath}>Dashboard</Link></li>}
        {!token && <li><Link to="/signup" className="cta">Sign Up</Link></li>}
        {token && <li><LogoutButton /></li>}
      </ul>
    </nav>
  );
};

export default Navbar;