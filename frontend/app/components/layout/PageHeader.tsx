import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from '@remix-run/react';
import Breadcrumbs from './Breadcrumbs';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions }) => {
  const location = useLocation();

  return (
    <div className="mb-8">
      <Breadcrumbs />
      <div className="flex justify-between items-start">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {description}
            </p>
          )}
        </motion.div>
        {actions && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {actions}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PageHeader; 