import { json, LoaderFunction } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaPlus, FaLock, FaUnlock } from 'react-icons/fa';
import { requireUser } from '~/auth.server';
import { prisma } from '~/db.server';
import { Button } from '~/components/common/Button';
import { Layout } from '~/components/Layout';
import { WishlistHeader } from '~/components/wishlist/WishlistHeader';
import { WishlistGrid } from '~/components/wishlist/WishlistGrid';
import { AddWishlistItemModal } from '~/components/wishlist/AddWishlistItemModal';
import type { WishlistItem } from '~/types/wishlist';

interface LoaderData {
  items: WishlistItem[];
  isPublic: boolean;
  user: {
    id: string;
    username: string;
  };
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  return json<LoaderData>({
    items: wishlist?.items || [],
    isPublic: wishlist?.isPublic || false,
    user: {
      id: user.id,
      username: user.username
    }
  });
};

export default function WishlistLayout() {
  const { items, isPublic, user } = useLoaderData<LoaderData>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WishlistHeader
          title={`${user.username}'s Wishlist`}
          rightContent={
            <div className="flex gap-4">
              <Button onClick={() => setIsModalOpen(true)} icon={<FaPlus />}>
                Add Item
              </Button>
              <Button icon={isPublic ? <FaUnlock /> : <FaLock />}>
                {isPublic ? 'Make Private' : 'Make Public'}
              </Button>
            </div>
          }
        />

        <Outlet context={{ items, isPublic, user }} />

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
    </Layout>
  );
}
