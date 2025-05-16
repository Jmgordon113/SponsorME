import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/axiosConfig';
import jwtDecode from 'jwt-decode';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'sponsor', // Default role
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await API.post('/auth/signup', formData);
      const token = res.data.token;
      const decoded: { userId: string; role: string; name: string } = jwtDecode(token);
      localStorage.setItem('token', token);
      localStorage.setItem('userId', decoded.userId);
      localStorage.setItem('role', decoded.role);
      localStorage.setItem('name', decoded.name);

      navigate('/login'); // Redirect to login after successful signup
    } catch (err) {
      console.error('Signup error:', err);
      setError('Failed to create account. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Role:
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="sponsor">Sponsor</option>
            <option value="sponsee">Sponsee</option>
          </select>
        </label>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
