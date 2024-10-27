import { motion } from 'framer-motion';
import type { IconType } from 'react-feather';

interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: IconType;
  color: string;
}

export default function MetricsCard({ title, value, change, icon: Icon, color }: MetricsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        {change !== undefined && (
          <div className={`text-sm font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
    </motion.div>
  );
}
