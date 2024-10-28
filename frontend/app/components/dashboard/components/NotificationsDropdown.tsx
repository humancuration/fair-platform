import React, { useState } from 'react';
import { Bell } from 'react-feather';
import { useTranslation } from 'react-i18next';

const NotificationsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
      >
        <Bell className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
            {t('notifications')}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {/* Add notifications list here */}
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              {t('noNotifications')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
