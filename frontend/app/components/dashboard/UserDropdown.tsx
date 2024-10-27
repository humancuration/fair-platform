import { useState, useRef } from 'react';
import { Link } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { useClickAway } from '~/hooks/useClickAway';
import type { User } from '~/types/auth';

interface UserDropdownProps {
  user?: User;
}

export default function UserDropdown({ user }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useClickAway(dropdownRef, () => setIsOpen(false));

  if (!user) return null;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <img
          src={user.avatar || '/images/default-avatar.png'}
          alt={user.name}
          className="h-8 w-8 rounded-full object-cover"
        />
        <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
          {user.name}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {t('common.profile')}
          </Link>
          <Link
            to="/settings"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {t('common.settings')}
          </Link>
          <button
            onClick={() => {/* Add logout logic */}}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {t('common.logout')}
          </button>
        </div>
      )}
    </div>
  );
}
