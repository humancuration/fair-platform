import React from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminPanel from '../components/AdminPanel';

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <AdminPanel />
      </main>
    </div>
  );
};

export default AdminDashboard;