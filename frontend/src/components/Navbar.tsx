import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import ThemeSwitcher from './ThemeSwitcher';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white dark:bg-gray-800 p-4 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-500">
          Fair Market
        </Link>
        <SearchBar />
        <ThemeSwitcher />
      </div>
    </nav>
  );
};

export default Navbar;
