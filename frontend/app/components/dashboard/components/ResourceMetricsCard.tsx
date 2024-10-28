import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Book, Users, Heart } from 'react-feather';

interface ResourceMetricsCardProps {
  title: string;
  value: number;
  change: number;
  type: 'compute' | 'learning' | 'contribution' | 'impact';
}

const ResourceMetricsCard: React.FC<ResourceMetricsCardProps> = ({
  title,
  value,
  change,
  type
}) => {
  const icons = {
    compute: Cpu,
    learning: Book,
    contribution: Users,
    impact: Heart
  };

  const Icon = icons[type];

  const colors = {
    compute: 'text-blue-500',
    learning: 'text-purple-500', 
    contribution: 'text-green-500',
    impact: 'text-red-500'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-full ${colors[type]} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${colors[type]}`} />
        </div>
        <div className={`text-sm font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change >= 0 ? '+' : ''}{change}%
        </div>
      </div>
      
      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
        {title}
      </h3>
      
      <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
        {value.toLocaleString()}
      </div>
    </motion.div>
  );
};

export default ResourceMetricsCard;
