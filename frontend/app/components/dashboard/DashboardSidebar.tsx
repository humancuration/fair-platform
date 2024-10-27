import { NavLink } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import {
  Home,
  BarChart2,
  Users,
  Settings,
  Database,
  Link as LinkIcon,
  Activity,
  Bot
} from 'react-feather';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'overview' },
  { path: '/dashboard/analytics', icon: BarChart2, label: 'analytics' },
  { path: '/dashboard/groups', icon: Users, label: 'groups' },
  { path: '/dashboard/affiliate', icon: LinkIcon, label: 'affiliate' },
  { path: '/dashboard/ai', icon: Bot, label: 'ai' },
  { path: '/dashboard/activity', icon: Activity, label: 'activity' },
  { path: '/dashboard/data', icon: Database, label: 'data' },
  { path: '/dashboard/settings', icon: Settings, label: 'settings' },
];

export default function DashboardSidebar() {
  const { t } = useTranslation();

  return (
    <aside className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map(({ path, icon: Icon, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
              >
                <Icon className="h-5 w-5 mr-3" />
                {t(`dashboard.${label}`)}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
