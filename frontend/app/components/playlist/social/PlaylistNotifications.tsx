import { useState } from "react";
import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaBell, FaUserFriends, FaHeart, FaComment, 
  FaShare, FaPlus 
} from "react-icons/fa";
import { getNotifications, markNotificationAsRead } from "~/models/social.server";
import type { PlaylistNotification } from "~/types/social";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.playlistId) throw new Error("Playlist ID is required");
  const notifications = await getNotifications(params.playlistId);
  return json({ notifications });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { action, notificationId } = Object.fromEntries(formData);

  if (action === "markAsRead") {
    await prisma.playlistNotification.update({
      where: { id: notificationId as string },
      data: { read: true }
    });
  }

  return json({ success: true });
};

export function PlaylistNotifications() {
  const { notifications } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [unreadCount, setUnreadCount] = useState(
    notifications.filter(n => !n.read).length
  );

  const getNotificationIcon = (type: PlaylistNotification['type']) => {
    switch (type) {
      case 'like': return <FaHeart className="text-red-400" />;
      case 'comment': return <FaComment className="text-blue-400" />;
      case 'share': return <FaShare className="text-green-400" />;
      case 'collaboration': return <FaUserFriends className="text-purple-400" />;
      case 'addition': return <FaPlus className="text-yellow-400" />;
      case 'mention': return <FaBell className="text-orange-400" />;
      default: return <FaBell />;
    }
  };

  const handleNotificationClick = (notification: PlaylistNotification) => {
    if (!notification.read) {
      fetcher.submit(
        { action: "markAsRead", notificationId: notification.id },
        { method: "post" }
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaBell /> Notifications
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-red-500 text-white text-xs px-2 py-1 rounded-full"
            >
              {unreadCount}
            </motion.div>
          )}
        </h2>
      </div>

      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={() => handleNotificationClick(notification)}
            className={`
              bg-white/5 rounded-lg p-4 mb-3 cursor-pointer
              ${!notification.read ? 'ring-1 ring-purple-500' : ''}
            `}
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/10 rounded-full">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <img
                    src={notification.userAvatar}
                    alt={notification.username}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="font-semibold">{notification.username}</span>
                </div>
                <p className="text-sm opacity-90">{notification.content}</p>
                <span className="text-xs opacity-60">
                  {new Date(notification.timestamp).toLocaleString()}
                </span>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
