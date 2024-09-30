import React from 'react';

interface NotificationItemProps {
  notification: {
    id: string;
    message: string;
    read: boolean;
    date: string;
  };
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  return (
    <li className={`p-2 rounded ${notification.read ? 'bg-gray-100' : 'bg-blue-100'}`}>
      <p>{notification.message}</p>
      <p className="text-sm text-gray-500">{new Date(notification.date).toLocaleString()}</p>
    </li>
  );
};

export default NotificationItem;