import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaSort, FaFilter } from 'react-icons/fa';
import { prisma } from '~/db.server';
import { Button } from '~/components/common/Button';
import { WishlistGrid } from '~/components/wishlist/WishlistGrid';
import { AddCommunityWishlistItemModal } from '~/components/wishlist/AddCommunityWishlistItemModal';
import { SortDropdown, FilterDropdown } from '~/components/wishlist/WishlistControls';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const sortBy = url.searchParams.get('sortBy') || 'date';
  const filterBy = url.searchParams.get('filterBy') || 'all';

  const items = await prisma.communityWishlistItem.findMany({
    take: 20,
    skip: (page - 1) * 20,
    orderBy: { [sortBy]: 'desc' },
    where: filterBy !== 'all' ? { status: filterBy } : undefined,
    include: { contributors: true }
  });

  const total = await prisma.communityWishlistItem.count();

  return json({
    items,
    hasMore: page * 20 < total,
    page
  });
};

export default function CommunityWishlistRoute() {
  const { items, hasMore, page } = useLoaderData<typeof loader>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetcher = useFetcher();

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <SortDropdown />
          <FilterDropdown />
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={<FaPlus />}>
          Create Project
        </Button>
      </div>

      <WishlistGrid items={items} type="community" />

      <AddCommunityWishlistItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
