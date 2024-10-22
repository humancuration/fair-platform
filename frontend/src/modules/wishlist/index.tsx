import React, { useState } from 'react';
import { useLoaderData, json, LoaderFunction } from '@remix-run/react';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { FaPlus, FaLock, FaUnlock } from 'react-icons/fa';
import { toast } from 'react-toastify';

import Layout from '~/components/Layout';
import WishlistItem from '~/components/WishlistItem';
import AddWishlistItemModal from '~/components/AddWishlistItemModal';
import Button from '~/components/common/Button';
import LoadingSpinner from '~/components/common/LoadingSpinner';
import { api } from '~/utils/api';
import { WishlistItem as WishlistItemType } from '~/types/wishlist';

export const loader: LoaderFunction = async ({ request }) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(['wishlist'], () =>
    api.get('/wishlist/private').then((res) => res.data)
  );

  return json({
    dehydratedState: dehydrate(queryClient),
  });
};

export default function WishlistPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: wishlist, isLoading } = useQuery<{
    items: WishlistItemType[];
    isPublic: boolean;
  }>(['wishlist'], () => api.get('/wishlist/private').then((res) => res.data));

  const addItemMutation = useMutation(
    (newItem: Omit<WishlistItemType, 'id'>) =>
      api.post('/wishlist/private', { item: newItem }),
    {
      onSuccess: () => {
        toast.success('Item added to your wishlist!');
        setIsModalOpen(false);
      },
      onError: () => {
        toast.error('Failed to add item.');
      },
    }
  );

  const removeItemMutation = useMutation(
    (id: string) => api.delete(`/wishlist/private/${id}`),
    {
      onSuccess: () => {
        toast.success('Item removed from your wishlist!');
      },
      onError: () => {
        toast.error('Failed to remove item.');
      },
    }
  );

  const togglePublicMutation = useMutation(
    (isPublic: boolean) => api.patch('/wishlist/private', { isPublic }),
    {
      onSuccess: (data) => {
        toast.success(`Wishlist is now ${data.isPublic ? 'public' : 'private'}`);
      },
      onError: () => {
        toast.error('Failed to update visibility.');
      },
    }
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <Layout>
      <PageContainer>
        <Header>
          <h1>Your Wishlist</h1>
          <ButtonGroup>
            <Button onClick={() => setIsModalOpen(true)} icon={<FaPlus />}>
              Add Item
            </Button>
            <Button
              onClick={() => togglePublicMutation.mutate(!wishlist?.isPublic)}
              icon={wishlist?.isPublic ? <FaUnlock /> : <FaLock />}
            >
              {wishlist?.isPublic ? 'Make Private' : 'Make Public'}
            </Button>
          </ButtonGroup>
        </Header>

        <AnimatePresence>
          <WishlistGrid>
            {wishlist?.items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <WishlistItem
                  item={item}
                  onRemove={() => removeItemMutation.mutate(item.id)}
                />
              </motion.div>
            ))}
          </WishlistGrid>
        </AnimatePresence>

        {wishlist?.items.length === 0 && (
          <EmptyState>
            <p>Your wishlist is empty. Add some items to get started!</p>
          </EmptyState>
        )}

        <AddWishlistItemModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={(newItem) => addItemMutation.mutate(newItem)}
        />
      </PageContainer>
    </Layout>
  );
}

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2.5rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const WishlistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
