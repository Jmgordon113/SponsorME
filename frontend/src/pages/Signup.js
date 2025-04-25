import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../axiosConfig'; // Use the configured axios instance
import './Signup.css';

function Signup() {
  const [searchParams] = useSearchParams();
  const roleFromQuery = searchParams.get('role') || 'sponsor';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: roleFromQuery,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/signup', formData); // Use the configured axios instance
      const token = res.data.token;
      localStorage.setItem('token', token); // Save token to localStorage

      // Decode JWT to get role
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const role = decoded.role || formData.role;

      // Redirect to the appropriate dashboard
      navigate(role === 'sponsor' ? '/dashboard-sponsor' : '/dashboard-sponsee');
    } catch (err) {
      console.error('Signup failed:', err);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <h2>Create Your Account</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="sponsor">Sponsor</option>
          <option value="sponsee">Sponsee</option>
        </select>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
