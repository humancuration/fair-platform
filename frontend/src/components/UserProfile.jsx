// components/UserProfile.jsx
import React from 'react';

const UserProfile = ({ user, onEdit }) => (
  <div className="user-profile">
    <h2>{user.name}</h2>
    <p>Email: {user.email}</p>
    <button onClick={onEdit}>Edit Profile</button>
  </div>
);

export default UserProfile;
