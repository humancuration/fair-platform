import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@remix-run/react';
import { FaTimes, FaBell } from 'react-icons/fa';

interface NotificationsPanelProps {
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose }) => {
  // Example notifications - in real app, fetch from API
  const notifications = [
    {
      id: '1',
      type: 'mention',
      message: 'John mentioned you in a comment',
      time: '5m ago',
      read: false,
      link: '/comments/123'
    },
    {
      id: '2',
      type: 'group',
      message: 'New post in Eco Warriors group',
      time: '1h ago',
      read: true,
      link: '/groups/eco-warriors'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-50"
    >
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-y-auto h-[calc(100%-4rem)]">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <FaBell className="w-12 h-12 mb-4" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <Link
                key={notification.id}
                to={notification.link}
                className={`block p-4 hover:bg-gray-50 transition-colors duration-200 ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
                onClick={onClose}
              >
                <p className={`${!notification.read ? 'font-semibold' : ''}`}>
                  {notification.message}
                </p>
                <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NotificationsPanel; 