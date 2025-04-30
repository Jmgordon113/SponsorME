import React, { useState } from 'react';
import axios from '../utils/axiosConfig'; // Make sure baseURL = localhost:5001
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'sponsee', // Default role
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('/api/auth/signup', formData);
      const { token } = response.data;

      if (token) {
        localStorage.setItem('token', token); // ✅ Save the dynamic token here
        const decoded = JSON.parse(atob(token.split('.')[1]));
        navigate(decoded.role === 'sponsee' ? '/dashboard-sponsee' : '/dashboard-sponsor'); // ✅ Redirect based on role
      } else {
        setError('No token received. Please try again.');
      }
    } catch (err) {
      console.error('Signup failed:', err);
      setError('Failed to create account. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <h1>Signup</h1>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSignup}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        
        <label>Role:</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="sponsee">Sponsee</option>
          <option value="sponsor">Sponsor</option>
        </select>
        
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
