import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import CommunityWishlistItem from '../components/CommunityWishlistItem';
import AddCommunityWishlistItemModal from '../components/AddCommunityWishlistItemModal';
import Button from '../components/common/Button';
import api from '../utils/api';
import { toast } from 'react-toastify';
import Modal from '../components/common/Modal';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaPlus, FaSort, FaFilter } from 'react-icons/fa';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';

interface CommunityWishlistItemType {
  id: string;
  user: string;
  name: string;
  description: string;
  image: string;
  targetAmount: number;
  currentAmount: number;
  date: string;
}

const CommunityWishlistPage: React.FC = () => {
  const [communityWishlist, setCommunityWishlist] = useState<CommunityWishlistItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('date');
  const [filterBy, setFilterBy] = useState<string>('all');
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const user = useSelector((state: RootState) => state.auth.user);
  const [ref, inView] = useInView({
    threshold: 0,
  });

  const fetchCommunityWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/community-wishlist', {
        params: { page, sortBy, filterBy },
      });
      if (page === 1) {
        setCommunityWishlist(response.data.items);
      } else {
        setCommunityWishlist((prev) => [...prev, ...response.data.items]);
      }
      setHasMore(response.data.hasMore);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching community wishlist:', error);
      toast.error('Failed to load community wishlist.');
      setLoading(false);
    }
  }, [page, sortBy, filterBy]);

  useEffect(() => {
    fetchCommunityWishlist();
  }, [fetchCommunityWishlist]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, hasMore, loading]);

  const handleAddCommunityItem = async (newItem: Omit<CommunityWishlistItemType, 'id'>) => {
    try {
      const response = await api.post('/wishlist/community', { item: newItem });
      setCommunityWishlist([response.data, ...communityWishlist]);
      toast.success('Community wishlist item added!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding community wishlist item:', error);
      toast.error('Failed to add item.');
    }
  };

  const handleContribute = async (itemId: string, amount: number) => {
    try {
      await api.post(`/community-wishlist/${itemId}/contribute`, { amount });
      setCommunityWishlist((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? { ...item, currentAmount: item.currentAmount + amount }
            : item
        )
      );
      toast.success('Thank you for your contribution!');
    } catch (error) {
      console.error('Error contributing:', error);
      toast.error('Failed to contribute.');
    }
  };

  const handleSort = (newSortBy: string) => {
    setSortBy(newSortBy);
    setPage(1);
  };

  const handleFilter = (newFilterBy: string) => {
    setFilterBy(newFilterBy);
    setPage(1);
  };

  return (
    <Layout>
      <PageContainer>
        <Header>
          <h1>Community Wishlist</h1>
          <Button onClick={() => setIsModalOpen(true)} icon={<FaPlus />}>
            Add to Community Wishlist
          </Button>
        </Header>

        <ControlsContainer>
          <SortDropdown value={sortBy} onChange={(e) => handleSort(e.target.value)}>
            <option value="date">Sort by Date</option>
            <option value="targetAmount">Sort by Target Amount</option>
            <option value="currentAmount">Sort by Current Amount</option>
          </SortDropdown>
          <FilterDropdown value={filterBy} onChange={(e) => handleFilter(e.target.value)}>
            <option value="all">All Items</option>
            <option value="inProgress">In Progress</option>
            <option value="completed">Completed</option>
          </FilterDropdown>
        </ControlsContainer>

        {loading && page === 1 ? (
          <LoadingSpinner />
        ) : (
          <AnimatePresence>
            <WishlistGrid>
              {communityWishlist.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CommunityWishlistItem
                    item={item}
                    onContribute={(amount) => handleContribute(item.id, amount)}
                  />
                </motion.div>
              ))}
            </WishlistGrid>
          </AnimatePresence>
        )}

        {loading && page > 1 && <LoadingSpinner />}
        {!loading && hasMore && <div ref={ref} style={{ height: '20px' }} />}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add Community Wishlist Item"
        >
          <AddCommunityWishlistItemModal
            onAdd={handleAddCommunityItem}
            onClose={() => setIsModalOpen(false)}
          />
        </Modal>
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

const ControlsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SortDropdown = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const FilterDropdown = styled(SortDropdown)``;

const WishlistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

export default CommunityWishlistPage;
