import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col space-y-4">
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive ? 'text-blue-400' : 'text-gray-300 hover:text-white'
          }
        >
          User Management
        </NavLink>
        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            isActive ? 'text-blue-400' : 'text-gray-300 hover:text-white'
          }
        >
          Settings
        </NavLink>
        <NavLink
          to="/admin/reports"
          className={({ isActive }) =>
            isActive ? 'text-blue-400' : 'text-gray-300 hover:text-white'
          }
        >
          Reports
        </NavLink>
        {/* Add more admin links as needed */}
      </nav>
    </aside>
  );
};

export default AdminSidebar;