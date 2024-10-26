import { motion } from 'framer-motion';
import React from 'react';
import { FaLock, FaUnlock, FaPlus } from 'react-icons/fa';
import Button from '../common/Button';

interface WishlistHeaderProps {
  isPublic: boolean;
  onToggleVisibility: () => void;
  onAddItem: () => void;
  itemCount: number;
}

export default function WishlistHeader({
  isPublic,
  onToggleVisibility,
  onAddItem,
  itemCount
}: WishlistHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Wishlist</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </p>
        </div>
        
        <div className="flex gap-4">
          <Button
            onClick={onAddItem}
            className="flex items-center gap-2"
          >
            <FaPlus className="w-4 h-4" />
            Add Item
          </Button>
          
          <Button
            onClick={onToggleVisibility}
            variant="secondary"
            className="flex items-center gap-2"
          >
            {isPublic ? (
              <>
                <FaUnlock className="w-4 h-4" />
                Make Private
              </>
            ) : (
              <>
                <FaLock className="w-4 h-4" />
                Make Public
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
