import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';

const token = localStorage.getItem('token');
const role = localStorage.getItem('role');
const dashboardPath = role === 'sponsee' ? '/dashboard-sponsee' : '/dashboard-sponsor';

const Navbar: React.FC = () => (
  <nav>
    <Link to="/">Home</Link>
    {token && <Link to={dashboardPath}>Dashboard</Link>}
    {!token && <Link to="/login">Login</Link>}
    {!token && <Link to="/signup">Sign Up</Link>}
    {token && <LogoutButton />}
  </nav>
);

export default Navbar;