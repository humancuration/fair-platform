import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TermsOfServicePage: React.FC = () => {
  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Terms of Service</h1>
        {/* Insert Terms of Service content here */}
        <p>Terms of Service content goes here...</p>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfServicePage;