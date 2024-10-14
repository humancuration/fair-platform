// frontend/src/pages/NotificationsPage.tsx

import React, { useEffect, useState, useContext, useCallback } from 'react';
import api from '@api/api';
import { AuthContext } from '../contexts/AuthContext';
import { useQuery, useMutation } from '@apollo/client';
import { GET_NOTIFICATIONS, MARK_NOTIFICATION_AS_READ } from '../graphql/notificationOperations';

interface Notification {
  id: number;
  message: string;
  read: boolean;
  timestamp: string;
}

const NotificationsPage: React.FC = () => {
  const { token } = useContext(AuthContext);
  
  const { loading, data, refetch } = useQuery(GET_NOTIFICATIONS, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [markAsRead] = useMutation(MARK_NOTIFICATION_AS_READ);

  const handleMarkAsRead = useCallback(async (id: number) => {
    try {
      await markAsRead({
        variables: { id },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
      refetch();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [markAsRead, refetch, token]);

  if (loading) return <div className="text-center py-8">Loading notifications...</div>;

  const notifications: Notification[] = data?.notifications || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {notifications.length === 0 ? (
        <p className="text-gray-600">No new notifications.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notif: Notification) => (
            <li key={notif.id} className={`p-4 rounded shadow ${notif.read ? 'bg-gray-100' : 'bg-white'}`}>
              <div className="flex justify-between items-center">
                <span className="flex-grow">{notif.message}</span>
                <span className="text-gray-500 text-sm ml-4">{new Date(notif.timestamp).toLocaleString()}</span>
              </div>
              {!notif.read && (
                <button
                  onClick={() => handleMarkAsRead(notif.id)}
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
