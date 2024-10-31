import React, { useState } from 'react';
import { Link, NavLink, useLocation } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaBell, FaUser } from 'react-icons/fa';
import { useUser } from '~/hooks/useUser';
import UserMenu from './UserMenu';
import NotificationsPanel from './NotificationsPanel';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const { user } = useUser();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const navLinks = [
    { to: '/groups', label: 'Groups' },
    { to: '/campaigns', label: 'Campaigns' },
    { to: '/resources', label: 'Resources' },
    { to: '/marketplace', label: 'Marketplace' },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${isActive 
                    ? 'bg-primary-100 text-primary-900' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {user ? (
              <>
                {/* Notifications */}
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FaBell className="h-5 w-5 text-gray-600" />
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2"
                  >
                    <img
                      src={user.avatar || '/default-avatar.png'}
                      alt={user.name}
                      className="h-8 w-8 rounded-full"
                    />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <UserMenu onClose={() => setIsUserMenuOpen(false)} />
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium
                    ${isActive 
                      ? 'bg-primary-100 text-primary-900' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Panel */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <NotificationsPanel onClose={() => setIsNotificationsOpen(false)} />
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar; 