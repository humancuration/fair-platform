import React from 'react';
import { Link } from '@remix-run/react';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaCog, 
  FaWallet, 
  FaSignOutAlt,
  FaUserFriends,
  FaChartLine
} from 'react-icons/fa';

interface UserMenuProps {
  onClose: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ onClose }) => {
  const menuItems = [
    { icon: FaUser, label: 'Profile', to: '/profile' },
    { icon: FaUserFriends, label: 'Groups', to: '/groups' },
    { icon: FaWallet, label: 'Wallet', to: '/wallet' },
    { icon: FaChartLine, label: 'Analytics', to: '/analytics' },
    { icon: FaCog, label: 'Settings', to: '/settings' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
    >
      {menuItems.map(({ icon: Icon, label, to }) => (
        <Link
          key={to}
          to={to}
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          onClick={onClose}
        >
          <Icon className="w-5 h-5 mr-3" />
          {label}
        </Link>
      ))}
      
      <hr className="my-2" />
      
      <button
        onClick={() => {
          // Handle logout
          onClose();
        }}
        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
      >
        <FaSignOutAlt className="w-5 h-5 mr-3" />
        Sign Out
      </button>
    </motion.div>
  );
};

export default UserMenu; 