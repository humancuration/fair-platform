import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';

const UserProfilePage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const shareWishlist = () => {
    if (!user) return;
    const wishlistURL = `${window.location.origin}/wishlist/public/${user.username}`;
    navigator.clipboard.writeText(wishlistURL);
    toast.success('Wishlist link copied to clipboard!');
  };

  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        {user && (
          <>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <Button onClick={shareWishlist}>Share Public Wishlist</Button>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default UserProfilePage;
