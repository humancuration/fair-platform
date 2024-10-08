import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';
import ErrorDisplay from './ErrorDisplay';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <ErrorDisplay />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;