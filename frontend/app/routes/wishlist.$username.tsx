import { json, type LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { motion } from 'framer-motion';
import React from 'react';
import { prisma } from '../db.server';
import WishlistItem from '../components/wishlist/WishlistItem';

interface LoaderData {
  username: string;
  items: Array<{
    id: string;
    name: string;
    description: string;
    image?: string;
  }>;
}

export const loader: LoaderFunction = async ({ params }) => {
  const { username } = params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      wishlist: {
        include: {
          items: true
        }
      }
    }
  });

  if (!user || !user.wishlist?.isPublic) {
    throw new Response('Not Found', { status: 404 });
  }

  return json<LoaderData>({
    username,
    items: user.wishlist.items
  });
};

export default function PublicWishlistRoute() {
  const { username, items } = useLoaderData<LoaderData>();

  return (
    <div className="container mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-6">{username}'s Wishlist</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <WishlistItem key={item.id} item={item} isPublic />
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">This wishlist is empty.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
