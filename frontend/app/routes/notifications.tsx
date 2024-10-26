import { json, type LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';
import { requireUser } from '~/services/auth.server';
import { getUserNotifications } from '~/services/notifications.server';
import NotificationCard from '~/components/notifications/NotificationCard';
import type { Notification } from '~/types';

interface LoaderData {
  notifications: Notification[];
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  const notifications = await getUserNotifications(user.id);
  return json<LoaderData>({ notifications });
};

export default function Notifications() {
  const { notifications } = useLoaderData<typeof loader>();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4"
    >
      <h1 className="text-3xl font-bold mb-8">Notifications</h1>
      
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.05 }}
          >
            <NotificationCard notification={notification} />
          </motion.div>
        ))}
      </AnimatePresence>

      {notifications.length === 0 && (
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
}
