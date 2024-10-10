import React from 'react';

const AdminPanel: React.FC = () => {
  return (
    <div className="p-6 bg-white dark:bg-gray-700 rounded shadow">
      <h3 className="text-2xl font-semibold mb-4">Welcome to the Admin Dashboard</h3>
      <p>Use the sidebar to navigate through admin functionalities.</p>
      {/* Add admin-specific content here */}
    </div>
  );
};

export default AdminPanel;