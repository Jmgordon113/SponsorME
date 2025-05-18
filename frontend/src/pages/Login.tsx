import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/axiosConfig'; // Use the configured Axios instance
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  interface LoginResponse {
    token: string;
    user: {
      _id: string;
      name: string;
      role: string;
    };
  }
  
  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
  
      try {
        const res = await API.post<LoginResponse>('/api/auth/login', { email, password });
        const token = res.data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('userId', res.data.user._id);
        localStorage.setItem('name', res.data.user.name);
        localStorage.setItem('role', res.data.user.role);
  
        if (res.data.user.role === 'sponsee') {
          navigate('/dashboard-sponsee');
        } else {
          navigate('/dashboard-sponsor');
        }
      } catch (err: any) {
        console.error('Login failed:', err);
        setError('Invalid email or password. Please try again.');
      }
    };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleLogin}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
