import { json, type LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import { prisma } from '../db.server';
import { requireUser } from '../auth.server';
import WishlistItem from '../components/wishlist/WishlistItem';
import AddWishlistItemModal from '../components/wishlist/AddWishlistItemModal';
import Button from '../components/common/Button';
import { FaPlus, FaLock, FaUnlock } from 'react-icons/fa';

interface WishlistItem {
  id: string;
  name: string;
  description: string;
  image?: string;
  isPublic: boolean;
}

interface LoaderData {
  items: WishlistItem[];
  isPublic: boolean;
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: user.id },
    include: {
      items: true
    }
  });

  return json<LoaderData>({
    items: wishlist?.items || [],
    isPublic: wishlist?.isPublic || false
  });
};

export default function WishlistRoute() {
  const { items, isPublic } = useLoaderData<LoaderData>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Wishlist</h1>
        <div className="flex gap-4">
          <Button onClick={() => setIsModalOpen(true)} icon={<FaPlus />}>
            Add Item
          </Button>
          <Button 
            onClick={() => {/* Toggle public status */}}
            icon={isPublic ? <FaUnlock /> : <FaLock />}
          >
            {isPublic ? 'Make Private' : 'Make Public'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <WishlistItem item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {items.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-8 bg-gray-50 rounded-lg"
        >
          <p className="text-gray-600">Your wishlist is empty. Add some items to get started!</p>
        </motion.div>
      )}

      <AddWishlistItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
