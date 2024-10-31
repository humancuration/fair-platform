import React, { useState } from 'react';
import { Link } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useUser } from '~/hooks/useUser';

const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  const menuVariants = {
    closed: {
      x: '-100%',
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    open: {
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  const menuItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/groups', label: 'Groups' },
    { to: '/marketplace', label: 'Marketplace' },
    { to: '/eco', label: 'Eco Impact' },
    { to: '/forum', label: 'Forum' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-gray-600"
        aria-label="Toggle menu"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />

            {/* Menu */}
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white z-50 md:hidden"
            >
              <div className="p-4">
                {user && (
                  <div className="flex items-center space-x-3 mb-6 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={user.avatar || '/default-avatar.png'}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                )}

                <nav className="space-y-2">
                  {menuItems.map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      {label}
                    </Link>
                  ))}
                </nav>

                {user ? (
                  <div className="mt-6 p-4 border-t">
                    <Link
                      to="/settings"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        // Handle logout
                        setIsOpen(false);
                      }}
                      className="w-full px-4 py-2 mt-2 text-red-600 hover:bg-red-50 rounded-lg text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 p-4 border-t">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 text-center bg-primary-600 text-white rounded-lg"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNav; 