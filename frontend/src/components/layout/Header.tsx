import React from 'react';
import Navbar from '../Navbar';
import { Link } from 'react-router-dom';
import { useUser } from '../../modules/user/UserContext';

const Header: React.FC = () => {
  const { user } = useUser();

  return (
    <header className="bg-primary text-white p-4">
      <Navbar />
      {user && (
        <nav>
          <Link to="/profile">Profile</Link>
          <Link to="/settings">Settings</Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
