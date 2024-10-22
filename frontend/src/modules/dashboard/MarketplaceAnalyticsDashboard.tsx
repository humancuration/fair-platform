import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { fetchAnalytics } from '../../store/slices/marketplaceAnalyticsSlice';
import { RootState } from '../../store/store';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaShoppingCart, FaUsers, FaChartLine, FaPercent } from 'react-icons/fa';

const MarketplaceAnalyticsDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { metrics, loading, error, realtimeViewers, popularCategories } = 
    useSelector((state: RootState) => state.marketplaceAnalytics);

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  const statsCards = [
    {
      title: 'Daily Sales',
      value: metrics.daily,
      icon: <FaShoppingCart className="text-blue-500" size={24} />,
      change: '+12%',
    },
    {
      title: 'Active Users',
      value: realtimeViewers,
      icon: <FaUsers className="text-green-500" size={24} />,
      change: '+5%',
    },
    {
      title: 'Conversion Rate',
      value: `${metrics.conversionRate}%`,
      icon: <FaPercent className="text-purple-500" size={24} />,
      change: '+2.5%',
    },
    {
      title: 'Revenue',
      value: `$${metrics.total.toFixed(2)}`,
      icon: <FaChartLine className="text-red-500" size={24} />,
      change: '+15%',
    },
  ];

  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const categoryData = {
    labels: popularCategories.map(cat => cat.category),
    datasets: [
      {
        data: popularCategories.map(cat => cat.count),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      },
    ],
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      <h1 className="text-2xl font-bold mb-6">Marketplace Analytics</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              {stat.icon}
            </div>
            <div className="mt-4">
              <span className={`text-sm ${
                stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.change} from last month
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4">Sales Trend</h2>
          <Line data={salesData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
          <Doughnut data={categoryData} />
        </motion.div>
      </div>

      {/* Top Selling Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left">Product</th>
                <th className="px-6 py-3 text-left">Sales</th>
                <th className="px-6 py-3 text-left">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {metrics.topSellingProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">{product.sales}</td>
                  <td className="px-6 py-4">${product.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Affiliate Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Affiliate Performance</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left">Affiliate</th>
                <th className="px-6 py-3 text-left">Sales</th>
                <th className="px-6 py-3 text-left">Commission</th>
              </tr>
            </thead>
            <tbody>
              {metrics.affiliatePerformance.map((affiliate) => (
                <tr key={affiliate.userId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{affiliate.username}</td>
                  <td className="px-6 py-4">{affiliate.sales}</td>
                  <td className="px-6 py-4">${affiliate.commission.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MarketplaceAnalyticsDashboard;
