import React from 'react';
import { NavLink } from '@remix-run/react';
import { motion } from 'framer-motion';
import { 
  FaHome, 
  FaUsers, 
  FaChartBar, 
  FaCalendar,
  FaLeaf,
  FaHandshake,
  FaBook,
  FaCog
} from 'react-icons/fa';
import { useUser } from '~/hooks/useUser';

const Sidebar: React.FC = () => {
  const { user } = useUser();

  const navItems = [
    { to: '/dashboard', icon: FaHome, label: 'Dashboard' },
    { to: '/groups', icon: FaUsers, label: 'Groups' },
    { to: '/analytics', icon: FaChartBar, label: 'Analytics' },
    { to: '/calendar', icon: FaCalendar, label: 'Calendar' },
    { to: '/eco', icon: FaLeaf, label: 'Eco Impact' },
    { to: '/collaborations', icon: FaHandshake, label: 'Collaborations' },
    { to: '/resources', icon: FaBook, label: 'Resources' },
  ];

  const bottomItems = [
    { to: '/settings', icon: FaCog, label: 'Settings' },
  ];

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 bg-white border-r border-gray-200 min-h-screen p-4"
    >
      {/* User Profile Section */}
      <div className="mb-8 text-center">
        <img
          src={user?.avatar || '/default-avatar.png'}
          alt={user?.name}
          className="w-20 h-20 rounded-full mx-auto mb-4"
        />
        <h3 className="font-semibold text-gray-800">{user?.name}</h3>
        <p className="text-sm text-gray-500">{user?.role}</p>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200
              ${isActive 
                ? 'bg-primary-50 text-primary-700' 
                : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="absolute bottom-4 left-4 right-4">
        {bottomItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200
              ${isActive 
                ? 'bg-primary-50 text-primary-700' 
                : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </motion.aside>
  );
};

export default Sidebar; 