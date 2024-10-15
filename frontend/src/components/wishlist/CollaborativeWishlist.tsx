import React, { useEffect, useState } from 'react';
import api from '@api/api';
import AddWishlistItemModal from './AddWishlistItemModal';
import Button from './common/Button';

const CollaborativeWishlist: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await api.get('/wishlist/collaborative');
        setWishlistItems(response.data);
      } catch (error) {
        console.error('Error fetching collaborative wishlist:', error);
      }
    };

    fetchWishlist();
  }, []);

  const handleAddItem = async (item: any) => {
    try {
      const response = await api.post('/wishlist/collaborative', item);
      setWishlistItems([...wishlistItems, response.data]);
    } catch (error) {
      console.error('Error adding item to collaborative wishlist:', error);
    }
  };

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>Add Item to Wishlist</Button>
      <AddWishlistItemModal onAdd={handleAddItem} onClose={() => setIsModalOpen(false)} />

      <ul className="mt-4">
        {wishlistItems.map((item) => (
          <li key={item.id} className="border p-2 rounded mb-2">
            <h3 className="font-semibold">{item.name}</h3>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollaborativeWishlist;