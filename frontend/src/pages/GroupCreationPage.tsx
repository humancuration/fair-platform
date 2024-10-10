import React from 'react';
import CreateGroup from '../components/CreateGroup';

const GroupCreationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <CreateGroup />
    </div>
  );
};

export default GroupCreationPage;