import React from 'react';
import { motion } from 'framer-motion';

interface ContentWrapperProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

const ContentWrapper: React.FC<ContentWrapperProps> = ({ 
  children, 
  className = '',
  animate = true 
}) => {
  const content = (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );

  if (!animate) return content;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {content}
    </motion.div>
  );
};

export default ContentWrapper; 