import React from 'react';
import { NavLink, useLocation } from '@remix-run/react';
import { motion } from 'framer-motion';

interface SubNavItem {
  to: string;
  label: string;
  icon?: React.ComponentType;
}

interface SubNavProps {
  items: SubNavItem[];
  basePath: string;
}

const SubNav: React.FC<SubNavProps> = ({ items, basePath }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="bg-white border-b mb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8 overflow-x-auto">
          {items.map(({ to, label, icon: Icon }) => {
            const isActive = currentPath.startsWith(`${basePath}${to}`);
            
            return (
              <NavLink
                key={to}
                to={`${basePath}${to}`}
                className="relative py-4 px-1"
              >
                <div className="flex items-center space-x-2">
                  {Icon && <Icon className="w-5 h-5" />}
                  <span className={`${isActive ? 'text-primary-600' : 'text-gray-600'}`}>
                    {label}
                  </span>
                </div>
                
                {isActive && (
                  <motion.div
                    layoutId="subnav-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                    initial={false}
                  />
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default SubNav; 