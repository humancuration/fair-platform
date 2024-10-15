import React from 'react';
import AvatarCustomizer from './AvatarCustomizer';
import { useAuth } from '../../contexts/AuthContext'; // Assuming you have an auth context

const AvatarCustomizationPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Please log in to customize your avatar.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customize Your Avatar</h1>
      <AvatarCustomizer userId={user.id} />
    </div>
  );
};

export default AvatarCustomizationPage;
