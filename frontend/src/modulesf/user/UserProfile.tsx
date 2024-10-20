import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';

interface User {
  name: string;
  email: string;
}

interface UserProfileProps {
  user: User;
  onEdit: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onEdit }) => {
  const handleFollow = () => {
    // Implement follow functionality
    console.log(`Following ${user.name}`);
  };

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <svg className="icon follow-button" viewBox="0 0 64 64" onClick={handleFollow}>
        <circle cx="32" cy="32" r="30" stroke="#FF6F61" strokeWidth="4" fill="none" />
      </svg>
      <p>Email: {user.email}</p>
      <button onClick={onEdit}>Edit Profile</button>
    </div>
  );
};

export default UserProfile;
