import React from 'react';
import { useParams } from 'react-router-dom';

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  return (
    <div className="profile">
      <h1>User Profile</h1>
      <p>Profile details for user ID: {userId}</p>
    </div>
  );
};

export default Profile;
