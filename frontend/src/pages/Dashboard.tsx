import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import ThemeSwitcher from '../components/ThemeSwitcher';
import ThemeCustomizer from '../components/ThemeCustomizer';

const Dashboard: React.FC = () => {
  const { currentTheme, customStyles } = useSelector((state: RootState) => state.theme);

  const dashboardStyle = {
    ...customStyles,
    backgroundColor: currentTheme === 'dark' ? '#1a202c' : '#f7fafc',
  };

  return (
    <div className="flex" style={dashboardStyle}>
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
        </nav>
        <div className="mt-6">
          <ThemeSwitcher />
          <ThemeCustomizer />
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;