import { motion } from 'framer-motion';
import React from 'react';
import { Form } from '@remix-run/react';
import { FaTrash } from 'react-icons/fa';

interface WishlistItemProps {
  item: {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    targetAmount?: number;
    currentAmount?: number;
    isPublic?: boolean;
  };
  onRemove?: (id: string) => void;
}

export function WishlistItem({ item, onRemove }: WishlistItemProps) {
  const progress = item.targetAmount 
    ? (item.currentAmount || 0) / item.targetAmount * 100
    : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
    >
      {item.imageUrl && (
        <div className="relative h-48 w-full">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          {item.targetAmount && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
              <div className="relative w-full h-2 bg-gray-200 rounded">
                <div 
                  className="absolute left-0 top-0 h-full bg-green-500 rounded"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-sm mt-1 flex justify-between">
                <span>${item.currentAmount || 0}</span>
                <span>${item.targetAmount}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {item.name}
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {item.description}
        </p>

        {onRemove && (
          <Form method="post" className="mt-4">
            <input type="hidden" name="intent" value="removeItem" />
            <input type="hidden" name="itemId" value={item.id} />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
            >
              <FaTrash className="w-4 h-4" />
              Remove
            </motion.button>
          </Form>
        )}
      </div>
    </motion.div>
  );
}
