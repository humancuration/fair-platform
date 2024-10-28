import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'react-feather';
import { useTranslation } from 'react-i18next';
import DashboardCard from './DashboardCard';

interface Group {
  id: string;
  name: string;
  memberCount: number;
  resourceCredits: number;
  imageUrl?: string;
}

const GroupsOverviewSection: React.FC = () => {
  const { t } = useTranslation();

  // Mock data - replace with real data from your API
  const groups: Group[] = [
    {
      id: '1',
      name: 'Machine Learning Study Group',
      memberCount: 156,
      resourceCredits: 2500,
      imageUrl: '/images/ml-group.jpg'
    },
    {
      id: '2',
      name: 'Open Source Contributors',
      memberCount: 89,
      resourceCredits: 1800,
      imageUrl: '/images/opensource-group.jpg'
    },
    {
      id: '3',
      name: 'Community Research Lab',
      memberCount: 234,
      resourceCredits: 3200,
      imageUrl: '/images/research-group.jpg'
    }
  ];

  return (
    <DashboardCard title={t('dashboard.groups.title')}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <motion.div
            key={group.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {group.imageUrl ? (
                  <img
                    src={group.imageUrl}
                    alt={group.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {group.name}
                </h3>
                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{group.memberCount} members</span>
                  <span>•</span>
                  <span>{group.resourceCredits} credits</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardCard>
  );
};

export default GroupsOverviewSection;
