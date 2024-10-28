import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { useTranslation } from 'react-i18next';
import { Bell, Search, Settings } from 'react-feather';
import UserDropdown from './UserDropdown';
import NotificationsDropdown from './NotificationsDropdown';

const DashboardHeader: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { t } = useTranslation();

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Search className="h-5 w-5 text-gray-400" />
              </span>
              <input
                className="form-input w-full pl-10 pr-4 py-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                type="text"
                placeholder={t('search')}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <NotificationsDropdown />
            <button className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600">
              <Settings className="h-5 w-5" />
            </button>
            <UserDropdown user={user} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
