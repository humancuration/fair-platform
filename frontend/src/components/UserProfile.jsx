// components/UserProfile.jsx
import React from 'react';

const UserProfile = ({ user, onEdit }) => (
  <div className="user-profile">
    <h2>{user.name}</h2>
    <svg className="icon follow-button" viewBox="0 0 64 64" onClick={handleFollow}>
    <circle cx="32" cy="32" r="30" stroke="#FF6F61" stroke-width="4" fill="none" />
    </svg>
    <p>Email: {user.email}</p>
    <button onClick={onEdit}>Edit Profile</button>
  </div>
);

export default UserProfile;

