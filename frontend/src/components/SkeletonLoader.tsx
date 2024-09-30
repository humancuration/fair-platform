import React from 'react';

interface SkeletonLoaderProps {
  width?: string;
  height?: string;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = '1rem',
  className = '',
}) => {
  return (
    <div
      style={{ width, height }}
      className={`bg-gray-300 dark:bg-gray-700 rounded ${className} animate-pulse`}
    ></div>
  );
};

export default SkeletonLoader;