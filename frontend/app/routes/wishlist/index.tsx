import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FaPlus, FaLock, FaUnlock } from 'react-icons/fa';
import { requireUser } from '~/auth.server';
import { prisma } from '~/db.server';
import { Button } from '~/components/common/Button';
import { WishlistGrid } from '~/components/wishlist/WishlistGrid';
import { AddWishlistItemModal } from '~/components/wishlist/AddWishlistItemModal';
import type { WishlistItem } from '~/types/wishlist';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: user.id },
    include: { items: true }
  });

  return json({ items: wishlist?.items || [], isPublic: wishlist?.isPublic || false });
};

export default function PersonalWishlistRoute() {
  const { items, isPublic } = useLoaderData<typeof loader>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetcher = useFetcher();

  return (
    <>
      <div className="flex justify-between mb-6">
        <Button onClick={() => setIsModalOpen(true)} icon={<FaPlus />}>
          Add Item
        </Button>
        <fetcher.Form method="post">
          <input type="hidden" name="intent" value="togglePublic" />
          <Button type="submit" icon={isPublic ? <FaUnlock /> : <FaLock />}>
            {isPublic ? 'Make Private' : 'Make Public'}
          </Button>
        </fetcher.Form>
      </div>

      <WishlistGrid items={items} />

      <AddWishlistItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
