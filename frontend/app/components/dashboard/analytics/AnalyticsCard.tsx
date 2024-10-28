import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp } from 'react-feather';
import { useTranslation } from 'react-i18next';
import AnalyticsChart from './AnalyticsChart';

interface AnalyticsData {
  labels: string[];
  values: number[];
}

const AnalyticsCard: React.FC = () => {
  const { t } = useTranslation();

  // Mock data - replace with real data from your API
  const mockData: AnalyticsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [65, 72, 86, 81, 90, 95, 100]
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BarChart2 className="h-5 w-5 mr-2 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('dashboard.learningProgress')}
          </h2>
        </div>
        <div className="flex items-center text-green-500">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">+12.5%</span>
        </div>
      </div>

      <div className="h-64">
        <AnalyticsChart data={mockData} type="line" />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t('dashboard.completedCourses')}
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            24
          </div>
        </div>
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t('dashboard.earnedCertificates')}
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            8
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsCard;
