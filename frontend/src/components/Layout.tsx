import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Breadcrumbs from './Breadcrumbs';
import ErrorDisplay from './ErrorDisplay';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto p-4">
        <Breadcrumbs />
        <ErrorDisplay />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;