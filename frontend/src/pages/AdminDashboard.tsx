import React, { Suspense, lazy } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminPanel from '../components/AdminPanel';

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex">
      <Suspense fallback={<div>Loading sidebar...</div>}>
        <AdminSidebar />
      </Suspense>
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <Suspense fallback={<div>Loading panel...</div>}>
          <AdminPanel />
        </Suspense>
      </main>
    </div>
  );
};

export default AdminDashboard;