import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import WishlistItem from '../components/WishlistItem';
import api from '../utils/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

interface WishlistItemType {
  id: string;
  name: string;
  description: string;
  image: string;
  isPublic: boolean;
}

const UserProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [wishlist, setWishlist] = useState<WishlistItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fediverseProfile, setFediverseProfile] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserWishlist = async () => {
      try {
        const response = await api.get(`/user/${username}/public-wishlist`);
        setWishlist(response.data.wishlist);
        setFediverseProfile(response.data.fediverseProfile);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user public wishlist:', error);
        toast.error('Failed to load user wishlist.');
        setLoading(false);
      }
    };

    fetchUserWishlist();
  }, [username]);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">{username}'s Wishlist</h1>
        {fediverseProfile && (
          <p className="mb-4">
            Fediverse Profile: <a href={fediverseProfile} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{fediverseProfile}</a>
          </p>
        )}
        {loading ? (
          <LoadingSpinner />
        ) : wishlist.length === 0 ? (
          <p>This user has no public wishlist items.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <WishlistItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserProfilePage;
