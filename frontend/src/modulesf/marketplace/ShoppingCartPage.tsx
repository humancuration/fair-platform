import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../utils/api';
import { handleError } from '../utils/errorHandler';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const ShoppingCartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await api.get('/cart');
        setCartItems(response.data);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        {cartItems.length > 0 ? (
          <>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {cartItems.map((item) => (
                <li key={item.id} className="py-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400">Quantity: {item.quantity}</p>
                  </div>
                  <p className="text-lg font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex justify-between items-center">
              <p className="text-2xl font-bold">Total: ${calculateTotal().toFixed(2)}</p>
              <Button onClick={() => navigate('/checkout')}>Proceed to Checkout</Button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-xl mb-4">Your cart is currently empty.</p>
            <Button onClick={() => navigate('/marketplace')}>Go to Marketplace</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ShoppingCartPage;