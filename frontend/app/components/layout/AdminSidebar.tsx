import React from 'react';
import { NavLink } from 'react-router-dom';

const adminLinks = [
  { to: '/admin/users', label: 'User Management' },
  { to: '/admin/settings', label: 'Settings' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/grants', label: 'Grants' },
  { to: '/admin/distribute-dividends', label: 'Distribute Dividends' },
];

const AdminSidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col space-y-4">
        {adminLinks.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `transition-colors duration-200 ${isActive ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default React.memo(AdminSidebar);
