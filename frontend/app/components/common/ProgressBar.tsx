import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  animate?: boolean;
}

export default function ProgressBar({
  progress,
  color = 'blue',
  size = 'md',
  showLabel = false,
  className = '',
  animate = true
}: ProgressBarProps) {
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500'
  };

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2.5',
    lg: 'h-4'
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`
        w-full bg-gray-200 rounded-full dark:bg-gray-700 
        ${sizeClasses[size]}
      `}>
        <motion.div
          initial={animate ? { width: 0 } : { width: `${normalizedProgress}%` }}
          animate={{ width: `${normalizedProgress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`
            ${sizeClasses[size]} 
            ${colorClasses[color]} 
            rounded-full
          `}
        />
      </div>
      
      {showLabel && (
        <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          {normalizedProgress.toFixed(1)}%
        </div>
      )}
    </div>
  );
}
