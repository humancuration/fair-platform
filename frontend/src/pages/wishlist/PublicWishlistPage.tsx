import React, { useState, useEffect } from 'react';
import Layout from '@components/Layout';
import WishlistItem from '@components/WishlistItem';
import { useParams } from 'react-router-dom';
import api from '@api/api';
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

const PublicWishlistPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [wishlist, setWishlist] = useState<WishlistType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPublicWishlist = async () => {
      try {
        const response = await api.get(`/wishlist/public/${username}`);
        setWishlist(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching public wishlist:', error);
        toast.error('Failed to load public wishlist.');
        setLoading(false);
      }
    };

    fetchPublicWishlist();
  }, [username]);

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">{username}'s Public Wishlist</h1>
        
        {wishlist && (
          <ul className="mt-4">
            {wishlist.items.map((item) => (
              <WishlistItem key={item.id} item={{...item, isPublic: true}} />
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default PublicWishlistPage;
