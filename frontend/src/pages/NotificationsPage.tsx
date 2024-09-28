// frontend/src/pages/NotificationsPage.tsx

import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { io, Socket } from 'socket.io-client';

interface Notification {
  id: number;
  message: string;
  read: boolean;
  timestamp: string;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/notifications'); // Implement this endpoint
      setNotifications(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications. Please try again later.');
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/user/notifications/${id}/read`); // Implement this endpoint
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('Failed to update notification. Please try again.');
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Initialize Socket.IO client
    const newSocket = io('http://localhost:5000'); // Replace with your server URL
    setSocket(newSocket);

    // Listen for new notifications
    newSocket.on('newNotification', (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className={`p-4 rounded shadow ${
                notif.read ? 'bg-gray-100' : 'bg-white'
              }`}
            >
              <div className="flex justify-between">
                <span>{notif.message}</span>
                {!notif.read && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="text-blue-500 text-sm"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
              <span className="text-gray-500 text-xs">
                {new Date(notif.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;
