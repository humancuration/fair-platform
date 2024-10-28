import React from 'react';

interface Notification {
  id: string;
  message: string;
  read: boolean;
  date: string;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead }) => {
  return (
    <li className={`p-2 rounded ${notification.read ? 'bg-gray-100' : 'bg-blue-100'}`}>
      <div className="flex justify-between items-center">
        <p>{notification.message}</p>
        {!notification.read && onMarkAsRead && (
          <button
            onClick={() => onMarkAsRead(notification.id)}
            className="text-sm text-blue-500 hover:underline"
          >
            Mark as Read
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500">{new Date(notification.date).toLocaleString()}</p>
    </li>
  );
};

export default NotificationItem;