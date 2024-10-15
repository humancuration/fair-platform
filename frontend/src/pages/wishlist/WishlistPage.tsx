import React, { useState, useEffect } from 'react';
import Layout from '@components/Layout';
import WishlistItem from '@components/WishlistItem';
import AddWishlistItemModal from '@components/AddWishlistItemModal';
import Button from '@components/common/Button';
import api from '@api/api';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface WishlistItemType {
  id: string;
  name: string;
  description?: string;
  image?: string;
  price?: number;
}

interface WishlistType {
  id: number;
  name: string;
  description?: string;
  isPublic: boolean;
  items: WishlistItemType[];
}

interface AddWishlistItemModalProps {
  isOpen: boolean; // Ensure isOpen is defined as a required boolean
  onClose: () => void;
  onAdd: (item: Partial<WishlistItemType>) => Promise<void>;
}

const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState<WishlistType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await api.get(`/wishlist/private`);
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

  const handleAddItem = async (item: { name: string; description: string; image?: string; isPublic?: boolean }) => {
    // Ensure the item structure matches what AddWishlistItemModal expects
    try {
      const response = await api.post(`/wishlist/private/items`, item);
      setWishlist(prev => prev ? { ...prev, items: [...prev.items, response.data] } : null);
      toast.success('Item added to wishlist!');
    } catch (error) {
      console.error('Error adding wishlist item:', error);
      toast.error('Failed to add item.');
    }
  };

  const togglePublic = async (isPublic: boolean) => {
    try {
      await api.patch(`/wishlist/private`, { isPublic });
      setWishlist(prev => prev ? { ...prev, isPublic } : null);
      toast.success('Wishlist visibility updated!');
    } catch (error) {
      console.error('Error updating wishlist visibility:', error);
      toast.error('Failed to update visibility.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
        
        {wishlist && (
          <>
            <Button onClick={() => setIsModalOpen(true)}>Add Item</Button>
            <Button onClick={() => togglePublic(!wishlist.isPublic)}>
              {wishlist.isPublic ? 'Make Private' : 'Make Public'}
            </Button>
            
            <ul className="mt-4">
              {wishlist.items.map((item) => (
                <WishlistItem key={item.id} item={item} />
              ))}
            </ul>
          </>
        )}

        <AddWishlistItemModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddItem}
        />
      </div>
    </Layout>
  );
};
export default WishlistPage;
