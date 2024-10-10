import React from 'react';
import Layout from '../components/Layout';
import CheckoutForm from '../components/CheckoutForm';
import CheckoutOrderSummary from '../components/CheckoutOrderSummary'; // Import the Order Summary component

const CheckoutPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <CheckoutForm />
        {/* TODO: Implement order summary component */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <CheckoutOrderSummary />
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;