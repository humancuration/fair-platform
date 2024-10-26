import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import WishlistItem from './WishlistItem';

interface WishlistGridProps {
  items: Array<{
    id: string;
    name: string;
    description: string;
    image?: string;
  }>;
  isPublic?: boolean;
  onRemoveItem?: (id: string) => void;
}

export default function WishlistGrid({ items, isPublic = false, onRemoveItem }: WishlistGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.1 }}
            layout
          >
            <WishlistItem
              item={item}
              isPublic={isPublic}
              onRemove={onRemoveItem ? () => onRemoveItem(item.id) : undefined}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {items.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="col-span-full text-center p-12 bg-gray-50 dark:bg-gray-800 rounded-lg"
        >
          <p className="text-gray-500 dark:text-gray-400">
            {isPublic 
              ? "This wishlist is empty."
              : "Your wishlist is empty. Add some items to get started!"}
          </p>
        </motion.div>
      )}
    </div>
  );
}
