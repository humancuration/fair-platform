import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import CommunityWishlistItem from '../components/CommunityWishlistItem';
import AddCommunityWishlistItemModal from '../components/AddCommunityWishlistItemModal';
import Button from '../components/Button';
import api from '../utils/api';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import LoadingSpinner from '../components/LoadingSpinner';

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
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchCommunityWishlist = async () => {
      try {
        const response = await api.get('/community-wishlist');
        setCommunityWishlist(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching community wishlist:', error);
        toast.error('Failed to load community wishlist.');
        setLoading(false);
      }
    };

    fetchCommunityWishlist();
  }, []);

  const handleAddCommunityItem = async (item: Partial<CommunityWishlistItemType>) => {
    try {
      const response = await api.post('/community-wishlist', item);
      setCommunityWishlist((prev) => [response.data, ...prev]);
      toast.success('Item added to community wishlist!');
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

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Community Wishlist</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add to Community Wishlist</Button>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {communityWishlist.map((item) => (
              <CommunityWishlistItem
                key={item.id}
                item={item}
                onContribute={(amount) => handleContribute(item.id, amount)}
              />
            ))}
          </div>
        )}
      </div>

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
    </Layout>
  );
};

export default CommunityWishlistPage;