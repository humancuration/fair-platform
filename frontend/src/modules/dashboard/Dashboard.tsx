import React, { lazy, Suspense, useMemo } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const ThemeSwitcher = lazy(() => import('../../components/ThemeSwitcher'));
const ThemeCustomizer = lazy(() => import('../../components/ThemeCustomizer'));

const DASHBOARD_ROUTES = [
  { path: 'admin', label: 'Admin' },
  { path: 'eco-consultant', label: 'Eco Consultant' },
  { path: 'ai', label: 'AI' },
  { path: 'data-transparency', label: 'Data Transparency' },
  { path: 'settings', label: 'Settings' },
  { path: 'analytics', label: 'Analytics' },
  { path: 'dividends', label: 'Dividends' },
];

const Dashboard: React.FC = () => {
  const { currentTheme, customStyles } = useSelector((state: RootState) => state.theme);
  const { t } = useTranslation();

  const dashboardStyle = useMemo(() => ({
    ...customStyles,
    backgroundColor: currentTheme === 'dark' ? '#1a202c' : '#f7fafc',
  }), [currentTheme, customStyles]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `transition-colors duration-200 ${
      isActive ? 'text-blue-500 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:text-blue-500'
    }`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div 
      className="flex h-screen" 
      style={dashboardStyle}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <aside className="w-64 bg-gray-200 dark:bg-gray-800 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">{t('dashboard')}</h2>
        <nav className="flex flex-col space-y-2">
          {DASHBOARD_ROUTES.map(({ path, label }) => (
            <NavLink key={path} to={path} className={navLinkClass}>
              {t(label.toLowerCase())}
            </NavLink>
          ))}
        </nav>
        <Suspense fallback={<LoadingSpinner />}>
          <div className="mt-6 space-y-4">
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
    </motion.div>
  );
};

export default React.memo(Dashboard);
