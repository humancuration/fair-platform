import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '../../components/layout/AdminSidebar';
import AdminPanel from './AdminPanel';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useSelector } from 'react-redux';
import { RootState } from '../../modulesf/store';
import api from '../../api/api';
import { toast } from 'react-toastify';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  pendingReports: number;
}

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const { currentTheme } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        toast.error('Failed to load admin statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="flex h-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-y-auto bg-gray-100 dark:bg-gray-900">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Admin Dashboard</h1>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats && Object.entries(stats).map(([key, value]) => (
                <motion.div
                  key={key}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </h2>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {typeof value === 'number' && key.includes('Revenue')
                      ? `$${value.toLocaleString()}`
                      : value.toLocaleString()}
                  </p>
                </motion.div>
              ))}
            </div>
            <AdminPanel />
          </>
        )}
      </main>
    </motion.div>
  );
};

export default AdminDashboard;
