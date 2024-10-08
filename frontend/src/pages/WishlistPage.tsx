import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import WishlistItem from '../components/WishlistItem';
import AddWishlistItemModal from '../components/AddWishlistItemModal';
import Button from '../components/common/Button';
import api from '../utils/api';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Modal from '../components/common/Modal';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

interface WishlistItemType {
  id: string;
  name: string;
  description: string;
  image: string;
  isPublic: boolean;
}

const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState<WishlistItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await api.get(`/user/${user.id}/wishlist`);
        setWishlist(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        toast.error('Failed to load wishlist.');
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user.id]);

  const handleAddItem = async (item: Partial<WishlistItemType>) => {
    try {
      const response = await api.post(`/user/${user.id}/wishlist`, item);
      setWishlist((prev) => [...prev, response.data]);
      toast.success('Item added to wishlist!');
    } catch (error) {
      console.error('Error adding wishlist item:', error);
      toast.error('Failed to add item.');
    }
  };

  const togglePublic = async (itemId: string, isPublic: boolean) => {
    try {
      await api.patch(`/user/${user.id}/wishlist/${itemId}`, { isPublic });
      setWishlist((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, isPublic } : item))
      );
      toast.success('Wishlist visibility updated!');
    } catch (error) {
      console.error('Error updating wishlist visibility:', error);
      toast.error('Failed to update visibility.');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Item</Button>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {wishlist.map((item) => (
              <WishlistItem
                key={item.id}
                item={item}
                onTogglePublic={() => togglePublic(item.id, !item.isPublic)}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Wishlist Item"
      >
        <AddWishlistItemModal
          onAdd={handleAddItem}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </Layout>
  );
};

export default WishlistPage;