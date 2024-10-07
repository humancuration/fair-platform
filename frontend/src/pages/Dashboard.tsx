// frontend/src/pages/Dashboard.tsx

import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import ThemeSwitcher from '../components/ThemeSwitcher';
import AIDashboard from '../components/AIDashboard';

const Dashboard: React.FC = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-200 dark:bg-gray-800 p-4">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        <nav className="flex flex-col space-y-2">
          <NavLink
            to="affiliate-links"
            className={({ isActive }) =>
              isActive
                ? 'text-blue-500'
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-500'
            }
          >
            Affiliate Links
          </NavLink>
          <NavLink
            to="affiliate-analytics"
            className={({ isActive }) =>
              isActive
                ? 'text-blue-500'
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-500'
            }
          >
            Affiliate Analytics
          </NavLink>
          <NavLink
            to="profile"
            className={({ isActive }) =>
              isActive
                ? 'text-blue-500'
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-500'
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="settings"
            className={({ isActive }) =>
              isActive
                ? 'text-blue-500'
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-500'
            }
          >
            Settings
          </NavLink>
          <NavLink
            to="activity-log"
            className={({ isActive }) =>
              isActive
                ? 'text-blue-500'
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-500'
            }
          >
            Activity Log
          </NavLink>
          <NavLink
            to="notifications"
            className={({ isActive }) =>
              isActive
                ? 'text-blue-500'
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-500'
            }
          >
            Notifications
          </NavLink>
          <NavLink
            to="eco-consultant"
            className={({ isActive }) =>
              isActive
                ? 'text-blue-500'
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-500'
            }
          >
            Eco Consultant
          </NavLink>
        </nav>
        <div className="mt-6">
          <ThemeSwitcher />
        </div>
      </aside>

      <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-900">
        <AIDashboard />
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;