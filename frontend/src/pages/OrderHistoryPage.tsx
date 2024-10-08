import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import OrderItem from '../components/OrderItem';
import api from '../utils/api';
import { handleError } from '../utils/errorHandler';

const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Order History</h1>
        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length > 0 ? (
          orders.map(order => <OrderItem key={order.id} order={order} />)
        ) : (
          <p>You have no past orders.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default OrderHistoryPage;