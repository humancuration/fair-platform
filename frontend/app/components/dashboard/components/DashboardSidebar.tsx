import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DashboardSidebar: React.FC = () => {
  const { t } = useTranslation();

  const navItems = [
    { path: '/dashboard', label: 'overview' },
    { path: '/dashboard/analytics', label: 'analytics' },
    { path: '/dashboard/admin', label: 'admin' },
    { path: '/dashboard/eco-consultant', label: 'ecoConsultant' },
    { path: '/dashboard/ai', label: 'ai' },
    { path: '/dashboard/data-transparency', label: 'dataTransparency' },
    { path: '/dashboard/settings', label: 'settings' },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navItems.map(({ path, label }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  {t(`dashboard.${label}`)}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
