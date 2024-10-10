import React from 'react';
import GroupList from '../components/GroupList';

const GroupListPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-semibold mb-6">All Groups</h1>
      <GroupList />
    </div>
  );
};

export default GroupListPage;