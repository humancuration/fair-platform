import React, { lazy, Suspense } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import LoadingSpinner from '../components/LoadingSpinner';

const ThemeSwitcher = lazy(() => import('../components/ThemeSwitcher'));
const ThemeCustomizer = lazy(() => import('../components/ThemeCustomizer'));

const Dashboard: React.FC = () => {
  const { currentTheme, customStyles } = useSelector((state: RootState) => state.theme);

  const dashboardStyle = {
    ...customStyles,
    backgroundColor: currentTheme === 'dark' ? '#1a202c' : '#f7fafc',
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `transition-colors duration-200 ${isActive ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300 hover:text-blue-500'}`;

  return (
    <div className="flex h-screen" style={dashboardStyle}>
      <aside className="w-64 bg-gray-200 dark:bg-gray-800 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        <nav className="flex flex-col space-y-2">
          {['admin', 'eco-consultant', 'ai', 'data-transparency', 'settings'].map((route) => (
            <NavLink key={route} to={route} className={navLinkClass}>
              {route.charAt(0).toUpperCase() + route.slice(1).replace('-', ' ')}
            </NavLink>
          ))}
        </nav>
        <Suspense fallback={<LoadingSpinner />}>
          <div className="mt-6">
            <ThemeSwitcher />
            <ThemeCustomizer />
          </div>
        </Suspense>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};

export default Dashboard;
