import React from 'react';
import GlobalSearch from './GlobalSearch';

const Layout: React.FC = ({ children }) => {
  return (
    <div className="app-layout">
      <header>
        <nav>{/* Your navigation items */}</nav>
        <GlobalSearch />
      </header>
      <main>{children}</main>
      <footer>{/* Your footer content */}</footer>
    </div>
  );
};

export default Layout;