import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'react-feather';
import { useTranslation } from 'react-i18next';

interface TimelineEvent {
  id: string;
  title: string;
  type: 'contribution' | 'learning' | 'collaboration';
  timestamp: string;
}

const ContributionTimeline: React.FC = () => {
  const { t } = useTranslation();
  
  const events: TimelineEvent[] = [
    {
      id: '1',
      title: 'Contributed to ML Algorithm',
      type: 'contribution',
      timestamp: '2h ago'
    },
    {
      id: '2',
      title: 'Completed Advanced Python Course',
      type: 'learning',
      timestamp: '5h ago'
    },
    {
      id: '3',
      title: 'Joined Research Group',
      type: 'collaboration',
      timestamp: '1d ago'
    }
  ];

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'contribution':
        return 'bg-green-100 text-green-800';
      case 'learning':
        return 'bg-blue-100 text-blue-800';
      case 'collaboration':
        return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <div className="flex items-center mb-4">
        <Calendar className="h-5 w-5 mr-2 text-gray-500" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('dashboard.recentActivity')}
        </h2>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center space-x-3"
          >
            <div className={`px-2 py-1 rounded text-sm ${getEventColor(event.type)}`}>
              {event.type}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {event.title}
              </p>
              <p className="text-xs text-gray-500">
                {event.timestamp}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ContributionTimeline;
