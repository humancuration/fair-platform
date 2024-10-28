import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { motion } from "framer-motion";
import { FaBell, FaEnvelope, FaMobile, FaCog } from "react-icons/fa";
import { getNotificationPreferences, updateNotificationPreferences } from "~/models/social.server";
import type { NotificationPreference } from "~/types/social";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const preferences = await getNotificationPreferences(params.userId);
  return json({ preferences });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { userId, channel, enabled } = Object.fromEntries(formData);

  await updateNotificationPreferences(userId as string, {
    [channel as keyof NotificationPreference]: enabled === 'true'
  });

  return json({ success: true });
};

export function NotificationPreferences() {
  const { preferences } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const handleToggle = (channel: keyof NotificationPreference) => {
    fetcher.submit(
      {
        channel,
        enabled: (!preferences[channel]).toString()
      },
      { method: "post" }
    );
  };

  const channels = [
    {
      key: 'inApp' as const,
      icon: FaBell,
      title: 'In-App Notifications',
      description: 'Receive notifications while using the app'
    },
    {
      key: 'email' as const,
      icon: FaEnvelope,
      title: 'Email Notifications',
      description: 'Get updates in your inbox'
    },
    {
      key: 'push' as const,
      icon: FaMobile,
      title: 'Push Notifications',
      description: 'Receive mobile push notifications'
    }
  ];

  return (
    <motion.div
      className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <FaCog /> Notification Preferences
      </h2>

      <div className="space-y-4">
        {channels.map(({ key, icon: Icon, title, description }) => (
          <motion.div
            key={key}
            className="bg-white/5 rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Icon className="text-xl" />
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm opacity-70">{description}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle(key)}
                className={`
                  w-12 h-6 rounded-full relative transition-colors
                  ${preferences[key] ? 'bg-purple-500' : 'bg-white/20'}
                `}
              >
                <motion.div
                  className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
                  animate={{ x: preferences[key] ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
