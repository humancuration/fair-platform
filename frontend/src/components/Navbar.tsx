import React from 'react';
import { Link } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher';
import SearchBar from './SearchBar';

const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/">YourLogo</Link>
      </div>
      <div className="space-x-4">
        <Link to="/marketplace">Marketplace</Link>
        <Link to="/directory">Directory</Link>
        <Link to="/forums">Forums</Link>
        <Link to="/testimonials">Testimonials</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/about-us">About Us</Link>
        <Link to="/contact">Contact</Link>
        <SearchBar />
        <ThemeSwitcher />
      </div>
    </nav>
  );
};

export default Navbar;
