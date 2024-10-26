import { motion } from 'framer-motion';
import React from 'react';
import { Form } from '@remix-run/react';

interface WishlistItemProps {
  item: {
    id: string;
    name: string;
    description: string;
    image?: string;
  };
  isPublic?: boolean;
}

export default function WishlistItem({ item, isPublic = false }: WishlistItemProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
    >
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
      )}
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>
        
        {!isPublic && (
          <Form method="post">
            <input type="hidden" name="intent" value="removeItem" />
            <input type="hidden" name="itemId" value={item.id} />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
            >
              Remove from Wishlist
            </motion.button>
          </Form>
        )}
      </div>
    </motion.div>
  );
}
