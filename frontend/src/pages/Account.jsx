import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import LogoutButton from '../components/LogoutButton';
import './Account.css';

function Account() {
  const [user, setUser] = useState({ name: '', email: '', role: '' });
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const { data } = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({ name: data.name, email: data.email, role: data.role });
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError('Failed to load user info');
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.put('/api/users/me', { ...user, password });
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
      setShowConfirm(false);
      setPassword('');
    }
  };

  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="account-page">
      <div className="account-header-container">
        <h1>Account Settings</h1>
        <LogoutButton />
      </div>

      <form>
        <label>Name:</label>
        <input
          name="name"
          value={user.name}
          onChange={handleChange}
          placeholder="Enter your name"
        />

        <label>Email:</label>
        <input
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />

        <label>New Password:</label>
        <input
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Leave blank to keep current password"
        />

        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>

      {showConfirm && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to update your profile?</p>
            <button onClick={handleSubmit} disabled={loading}>
              Yes, update
            </button>
            <button onClick={() => setShowConfirm(false)} disabled={loading}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Account;
