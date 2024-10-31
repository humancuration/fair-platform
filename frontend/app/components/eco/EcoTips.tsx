import React, { useState } from 'react';
import { useLoaderData } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaThumbsUp, FaShare, FaBookmark } from 'react-icons/fa';
import type { EcoTip } from '~/types/eco';

interface EcoTipsProps {
  groupId?: string;
}

const EcoTips: React.FC<EcoTipsProps> = ({ groupId }) => {
  const { tips } = useLoaderData<{ tips: EcoTip[] }>();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'energy', 'waste', 'transport', 'food', 'community'];

  const filteredTips = selectedCategory === 'all' 
    ? tips 
    : tips.filter(tip => tip.category === selectedCategory);

  const handleTipAction = async (tipId: string, action: 'like' | 'share' | 'save') => {
    // Implementation for tip actions
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-semibold mb-6">Community Eco Tips</h2>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full capitalize ${
              selectedCategory === category
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <AnimatePresence>
        <div className="grid gap-4">
          {filteredTips.map((tip) => (
            <motion.div
              key={tip.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 rounded-lg bg-green-50 border border-green-100"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{tip.title}</h3>
                  <p className="text-gray-600 mt-2">{tip.description}</p>
                  {tip.impact && (
                    <div className="mt-2 text-sm text-green-600">
                      Potential Impact: {tip.impact}
                    </div>
                  )}
                </div>
                {tip.imageUrl && (
                  <img 
                    src={tip.imageUrl} 
                    alt={tip.title}
                    className="w-24 h-24 rounded-lg object-cover ml-4" 
                  />
                )}
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => handleTipAction(tip.id, 'like')}
                    className="flex items-center space-x-1 text-gray-600 hover:text-green-500"
                  >
                    <FaThumbsUp />
                    <span>{tip.likes} Likes</span>
                  </button>
                  <button 
                    onClick={() => handleTipAction(tip.id, 'share')}
                    className="flex items-center space-x-1 text-gray-600 hover:text-green-500"
                  >
                    <FaShare />
                    <span>Share</span>
                  </button>
                  <button 
                    onClick={() => handleTipAction(tip.id, 'save')}
                    className="flex items-center space-x-1 text-gray-600 hover:text-green-500"
                  >
                    <FaBookmark />
                    <span>Save</span>
                  </button>
                </div>
                <div className="text-gray-500">
                  Contributed by: {tip.author}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </motion.div>
  );
};

export default EcoTips;
