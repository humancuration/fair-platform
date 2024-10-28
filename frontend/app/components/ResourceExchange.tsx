import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHandHoldingHeart, FaBook, FaLaptopCode, FaUsers } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

interface ResourceExchangeProps {
  groupId: number;
}

type ResourceCategory = 'education' | 'computing' | 'mentorship' | 'collaboration';

interface Resource {
  id: string;
  category: ResourceCategory;
  title: string;
  description: string;
  contributor: string;
  points: number;
}

const ResourceExchange: React.FC<ResourceExchangeProps> = ({ groupId }) => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<ResourceCategory>('education');

  const categories = [
    { id: 'education', icon: FaBook, label: t('resources.categories.education') },
    { id: 'computing', icon: FaLaptopCode, label: t('resources.categories.computing') },
    { id: 'mentorship', icon: FaUsers, label: t('resources.categories.mentorship') },
    { id: 'collaboration', icon: FaHandHoldingHeart, label: t('resources.categories.collaboration') }
  ];

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 flex items-center">
        <FaHandHoldingHeart className="mr-2 text-blue-500" />
        {t('resources.title')}
      </h2>

      {/* Category Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {categories.map(({ id, icon: Icon, label }) => (
          <motion.button
            key={id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-4 rounded-lg flex flex-col items-center justify-center transition-colors
              ${activeCategory === id ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            onClick={() => setActiveCategory(id as ResourceCategory)}
          >
            <Icon className="text-2xl mb-2" />
            <span className="text-sm font-medium">{label}</span>
          </motion.button>
        ))}
      </div>

      {/* Resource Exchange Interface */}
      <div className="space-y-4">
        {/* Add resource listing and exchange functionality */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 border border-blue-100 rounded-lg bg-blue-50"
        >
          <p className="text-center text-gray-600">
            {t('resources.comingSoon')}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ResourceExchange;
