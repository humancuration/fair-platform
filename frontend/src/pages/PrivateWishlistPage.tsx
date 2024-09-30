const PrivateWishlistPage: React.FC = () => {
  // ... (keep the existing state and useEffect)

  const handleAddItem = async (newItem: Omit<WishlistItem, 'id'>) => {
    try {
      const response = await api.post('/wishlist/private', { item: newItem });
      setItems([...items, response.data]);
      toast.success('Item added to your wishlist!');
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

  // ... (keep the rest of the component as it is)
};

export default PrivateWishlistPage;