import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import WishlistItem from '../components/WishlistItem';
import AddWishlistItemModal from '../components/AddWishlistItemModal';
import Button from '../components/common/Button';
import api from '../utils/api';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/common/LoadingSpinner';
import styled from 'styled-components';
import { FaPlus, FaLock, FaUnlock } from 'react-icons/fa';

interface WishlistItem {
  id: string;
  name: string;
  description?: string;
  image?: string;
  price?: number;
}

const PrivateWishlistPage: React.FC = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/wishlist/private');
      setItems(response.data.items);
      setIsPublic(response.data.isPublic);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleAddItem = async (newItem: Omit<WishlistItem, 'id'>) => {
    try {
      const response = await api.post('/wishlist/private', { item: newItem });
      setItems([...items, response.data]);
      toast.success('Item added to your wishlist!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
      toast.error('Failed to add item.');
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      await api.delete(`/wishlist/private/${id}`);
      setItems(items.filter((item) => item.id !== id));
      toast.success('Item removed from your wishlist!');
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      toast.error('Failed to remove item.');
    }
  };

  const togglePublic = async () => {
    try {
      const newPublicState = !isPublic;
      await api.patch('/wishlist/private', { isPublic: newPublicState });
      setIsPublic(newPublicState);
      toast.success(`Wishlist is now ${newPublicState ? 'public' : 'private'}`);
    } catch (error) {
      console.error('Error updating wishlist visibility:', error);
      toast.error('Failed to update visibility.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      <PageContainer>
        <Header>
          <h1>Your Wishlist</h1>
          <ButtonGroup>
            <Button onClick={() => setIsModalOpen(true)} icon={<FaPlus />}>
              Add Item
            </Button>
            <Button onClick={togglePublic} icon={isPublic ? <FaUnlock /> : <FaLock />}>
              {isPublic ? 'Make Private' : 'Make Public'}
            </Button>
          </ButtonGroup>
        </Header>

        <AnimatePresence>
          <WishlistGrid>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <WishlistItem
                  item={item}
                  onRemove={() => handleRemoveItem(item.id)}
                />
              </motion.div>
            ))}
          </WishlistGrid>
        </AnimatePresence>

        {items.length === 0 && (
          <EmptyState>
            <p>Your wishlist is empty. Add some items to get started!</p>
          </EmptyState>
        )}

        <AddWishlistItemModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddItem}
        />
      </PageContainer>
    </Layout>
  );
};

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

export default PrivateWishlistPage;
