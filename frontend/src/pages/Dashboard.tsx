// frontend/src/pages/Dashboard.tsx

import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { MenuIcon, XIcon } from '@heroicons/react/outline'; // Install heroicons if not already

const Dashboard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar for larger screens */}
      <aside className="hidden md:block w-64 bg-gray-800 text-white min-h-screen">
        <div className="p-4 text-2xl font-bold">Dashboard</div>
        <nav className="mt-10">
          <NavLink to="/dashboard/affiliate-links" className="block py-2 px-4 hover:bg-gray-700">
            Affiliate Links
          </NavLink>
          <NavLink to="/dashboard/affiliate-analytics" className="block py-2 px-4 hover:bg-gray-700">
            Analytics
          </NavLink>
          <NavLink to="/dashboard/profile" className="block py-2 px-4 hover:bg-gray-700">
            Profile
          </NavLink>
          <NavLink to="/dashboard/settings" className="block py-2 px-4 hover:bg-gray-700">
            Settings
          </NavLink>
          <NavLink to="/dashboard/activity-log" className="block py-2 px-4 hover:bg-gray-700">
            Activity Log
          </NavLink>
          <NavLink to="/dashboard/notifications" className="block py-2 px-4 hover:bg-gray-700">
            Notifications
          </NavLink>
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 focus:outline-none"
        >
          <MenuIcon className="h-6 w-6 text-gray-800" />
        </button>

        {isOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="relative w-64 bg-gray-800 text-white">
              <button
                onClick={() => setIsOpen(false)}
                className="p-4 focus:outline-none"
              >
                <XIcon className="h-6 w-6 text-white" />
              </button>
              <nav className="mt-10">
                <NavLink to="/dashboard/affiliate-links" className="block py-2 px-4 hover:bg-gray-700">
                  Affiliate Links
                </NavLink>
                <NavLink to="/dashboard/affiliate-analytics" className="block py-2 px-4 hover:bg-gray-700">
                  Analytics
                </NavLink>
                <NavLink to="/dashboard/profile" className="block py-2 px-4 hover:bg-gray-700">
                  Profile
                </NavLink>
                <NavLink to="/dashboard/settings" className="block py-2 px-4 hover:bg-gray-700">
                  Settings
                </NavLink>
                <NavLink to="/dashboard/activity-log" className="block py-2 px-4 hover:bg-gray-700">
                  Activity Log
                </NavLink>
                <NavLink to="/dashboard/notifications" className="block py-2 px-4 hover:bg-gray-700">
                  Notifications
                </NavLink>
              </nav>
            </div>
            <div
              className="flex-1 bg-black opacity-50"
              onClick={() => setIsOpen(false)}
            ></div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
