import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import axios from '../axiosConfig'; // Use the configured axios instance
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'sponsor' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const response = await axios.post('/api/auth/login', formData); // Send a POST request
      const { token } = response.data;
      localStorage.setItem('token', token); // Save token to localStorage

      // Decode JWT to get user role
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;

      // Ensure the selected role matches the token's role
      if (userRole !== formData.role) {
        alert('Selected role does not match the account role.');
        return;
      }

      // Redirect based on user role
      if (userRole === 'sponsor') {
        navigate('/dashboard-sponsor');
      } else if (userRole === 'sponsee') {
        navigate('/dashboard-sponsee');
      } else {
        alert('Invalid user role');
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
