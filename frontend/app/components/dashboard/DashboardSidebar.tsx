import { NavLink } from '@remix-run/react';
import { useUser } from '~/utils/user';

const navItems = [
  { to: "/dashboard", label: "Overview", icon: "HomeIcon" },
  { to: "/dashboard/analytics", label: "Analytics", icon: "ChartBarIcon" },
  { to: "/dashboard/ai", label: "AI Tools", icon: "ChipIcon" },
  { to: "/dashboard/learning", label: "Learning", icon: "AcademicCapIcon" },
  { to: "/dashboard/community", label: "Community", icon: "UsersIcon" },
] as const;

export default function DashboardSidebar() {
  const user = useUser();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex flex-col h-full">
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <img 
              src={user.avatarUrl} 
              alt={user.name}
              className="h-8 w-8 rounded-full" 
            />
            <span className="font-medium dark:text-white">{user.name}</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200" 
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`
              }
            >
              <Icon className="h-5 w-5 mr-3" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
