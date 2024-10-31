import React from 'react';
import { Outlet } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useUser } from '~/hooks/useUser';
import { ToastContainer } from 'react-toastify';

const Root: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex">
        {user && <Sidebar />}
        
        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Footer />
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Root; 