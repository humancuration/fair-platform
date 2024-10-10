// frontend/src/pages/Dashboard.tsx

import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import ThemeSwitcher from '../components/ThemeSwitcher';
import AdminDashboard from './AdminDashboard';
import EcoConsultantDashboard from './EcoConsultantDashboard';
import AIDashboard from '../components/AIDashboard';
import DataTransparencyDashboard from '../components/DataTransparencyDashboard';
import UserSettings from '../components/UserSettings';
import GPUMarketplace from '../components/GPUMarketplace';

const Dashboard: React.FC = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-200 dark:bg-gray-800 p-4">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        <nav className="flex flex-col space-y-2">
          <NavLink to="admin" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300 hover:text-blue-500'}>
            Admin
          </NavLink>
          <NavLink to="eco-consultant" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300 hover:text-blue-500'}>
            Eco Consultant
          </NavLink>
          <NavLink to="ai" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300 hover:text-blue-500'}>
            AI Dashboard
          </NavLink>
          <NavLink to="data-transparency" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300 hover:text-blue-500'}>
            Data Transparency
          </NavLink>
          <NavLink to="settings" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300 hover:text-blue-500'}>
            Settings
          </NavLink>
          {/* Add other dashboard links as needed */}
        </nav>
        <div className="mt-6">
          <ThemeSwitcher />
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-900">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;