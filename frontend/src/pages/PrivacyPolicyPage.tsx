import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
        {/* Insert Privacy Policy content here */}
        <p>Privacy Policy content goes here...</p>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;