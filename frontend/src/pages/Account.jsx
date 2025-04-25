import React, { useState, useEffect } from 'react';
import { updateUserProfile } from '../utils/axiosConfig';
import axios from '../utils/axiosConfig';
import { toast } from 'react-toastify';

const Account = () => {
  const [user, setUser] = useState({ name: '', email: '', role: '' });
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('/api/users/me');
        setUser({ name: data.name, email: data.email, role: data.role });
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        toast.error('Failed to load user info');
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
      await updateUserProfile({ ...user, password });
      toast.success('✅ Profile updated successfully!');
    } catch (err) {
      toast.error('❌ Failed to update profile.');
    } finally {
      setLoading(false);
      setShowConfirm(false);
      setPassword('');
    }
  };

  return (
    <div className="account-page">
      <h2>Account Settings</h2>

      <form>
        <label>Name:</label>
        <input name="name" value={user.name} onChange={handleChange} />

        <label>Email:</label>
        <input name="email" value={user.email} onChange={handleChange} />

        <label>New Password:</label>
        <input
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Leave blank to keep current"
        />

        <button type="button" onClick={() => setShowConfirm(true)} disabled={loading}>
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
};

export default Account;
