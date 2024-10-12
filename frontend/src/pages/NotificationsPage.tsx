// frontend/src/pages/NotificationsPage.tsx

import React, { useEffect, useState, useContext } from 'react';
import api from '@api/api';
import { AuthContext } from '../contexts/AuthContext';

interface Notification {
  id: number;
  message: string;
  read: boolean;
  timestamp: string;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await api.post(`/notifications/${id}/read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications((prev: Notification[]) =>
        prev.map((notif: Notification) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  if (loading) return <div>Loading notifications...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notif: Notification) => (
            <li key={notif.id} className={`p-4 rounded shadow ${notif.read ? 'bg-gray-100' : 'bg-white'}`}>
              <div className="flex justify-between">
                <span>{notif.message}</span>
                <span className="text-gray-500 text-sm">{new Date(notif.timestamp).toLocaleString()}</span>
              </div>
              {!notif.read && (
                <button
                  onClick={() => markAsRead(notif.id)}
                  className="mt-2 text-blue-500 hover:underline text-sm"
                >
                  Mark as Read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;