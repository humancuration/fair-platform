import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Button from './common/Button';
import { toast } from 'react-toastify';

const UserProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const shareWishlist = () => {
    const wishlistURL = `${window.location.origin}/u/${user.username}/wishlist`;
    navigator.clipboard.writeText(wishlistURL);
    toast.success('Wishlist link copied to clipboard!');
  };

  return (
    <div className="profile-container">
      <h2 className="text-xl font-semibold">{user.username}</h2>
      {/* ... other profile details */}
      <Button onClick={shareWishlist}>Share Wishlist</Button>
    </div>
  );
};

export default UserProfile;