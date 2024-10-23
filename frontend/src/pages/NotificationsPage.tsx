// frontend/src/pages/NotificationsPage.tsx

import React, { useEffect, useState, useContext, useCallback } from 'react';
import api from '@/utils/api';
import { AuthContext } from '../contexts/AuthContext';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { GET_NOTIFICATIONS, MARK_NOTIFICATION_AS_READ, NOTIFICATION_SUBSCRIPTION } from '../graphql/notificationOperations';
import { motion, AnimatePresence } from 'framer-motion';
import type { Notification } from '../types';

interface LoaderData {
  initialNotifications: Notification[];
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  const initialNotifications = await getInitialNotifications(user.id);
  return json<LoaderData>({ initialNotifications });
};

const NotificationsPage: React.FC = () => {
  const { token } = useContext(AuthContext);
  const { initialNotifications } = useLoaderData<LoaderData>();
  
  const { data, loading } = useQuery(GET_NOTIFICATIONS, {
    fetchPolicy: 'cache-and-network'
  });

  // Real-time notification updates
  useSubscription(NOTIFICATION_SUBSCRIPTION, {
    onData: ({ data }) => {
      if (data?.notification) {
        // Update notifications cache
        cache.modify({
          fields: {
            notifications(existingNotifications = []) {
              return [data.notification, ...existingNotifications];
            }
          }
        });
      }
    }
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

  const notifications = data?.notifications || initialNotifications;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4"
    >
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-lg shadow-md mb-4 ${
              notification.read ? 'bg-gray-50' : 'bg-white'
            }`}
          >
            <NotificationCard 
              notification={notification}
              onMarkAsRead={() => handleMarkAsRead(notification.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {loading && <LoadingSpinner />}
      
      {!loading && notifications.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500"
        >
          No new notifications
        </motion.p>
      )}
    </motion.div>
  );
};

export default NotificationsPage;
