import React from 'react';
import Navbar from './Navbar';

const Header: React.FC = () => {
  return (
    <header className="bg-primary text-white p-4">
      <Navbar />
    </header>
  );
};

export default Header;
