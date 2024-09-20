import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode }) => {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-900">
      <div>
        <Link to="/" className="text-xl font-bold">FairPlatform</Link>
      </div>
      <div className="flex items-center">
        <Link to="/marketplace" className="mr-4">Marketplace</Link>
        <Link to="/builder" className="mr-4">Builder</Link>
        {darkMode ? (
          <button onClick={() => setDarkMode(false)} className="text-yellow-500">
            🌞
          </button>
        ) : (
          <button onClick={() => setDarkMode(true)} className="text-gray-800">
            🌙
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
