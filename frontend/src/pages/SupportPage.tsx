import React from 'react';
import Layout from '../components/Layout';
import SupportForm from '../components/SupportForm';

const SupportPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Support</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <SupportForm />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Support Information</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our support team is available Monday to Friday, 9 AM to 5 PM EST.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Email: support@fairmarket.com
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Phone: 1-800-123-4567
            </p>
            {/* TODO: Add more support information or FAQs */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SupportPage;