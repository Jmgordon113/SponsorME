import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import './Account.css';
import LogoutButton from '../components/LogoutButton'; // Import LogoutButton

const Account = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/api/users/me');
        setProfile(data);
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) return <p>Loading profile...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="account-container">
      <div className="account-header-container">
        <h1>My Account</h1>
        <LogoutButton /> {/* Add LogoutButton */}
      </div>
      {profile && (
        <div className="profile-card">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          {/* Optional: Add edit button here */}
        </div>
      )}
    </div>
  );
};

export default Account;
