import { Link } from '@remix-run/react';
import { Bell, Search, Settings } from 'react-feather';
import UserDropdown from './UserDropdown';
import NotificationsDropdown from './NotificationsDropdown';
import { useTranslation } from 'react-i18next';

export default function DashboardHeader() {
  const { t } = useTranslation();

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold text-gray-800 dark:text-white">
              Fair Platform
            </Link>
            <div className="relative ml-6">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Search className="h-5 w-5 text-gray-400" />
              </span>
              <input
                className="form-input w-full pl-10 pr-4 py-2 border-gray-300 dark:border-gray-600 rounded-lg 
                          text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:border-blue-500 
                          dark:focus:border-blue-500 focus:outline-none focus:ring"
                type="text"
                placeholder={t('common.search')}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <NotificationsDropdown />
            <Link 
              to="/dashboard/settings"
              className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            >
              <Settings className="h-5 w-5" />
            </Link>
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
