import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import type { Json } from "~/types/models";

interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationCenterProps {
  notifications: Json[];
  onNotificationRead: (notificationId: string) => void;
}

export function NotificationCenter({ notifications, onNotificationRead }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const fetcher = useFetcher();

  useEffect(() => {
    const count = (notifications as Notification[]).filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  const handleMarkAsRead = (notificationId: string) => {
    fetcher.submit(
      { notificationId, intent: "markAsRead" },
      { method: "post", action: "/api/notifications" }
    );
    onNotificationRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    fetcher.submit(
      { intent: "markAllAsRead" },
      { method: "post", action: "/api/notifications" }
    );
    (notifications as Notification[]).forEach(n => onNotificationRead(n.id));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900"
      >
        <span className="material-icons">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50"
          >
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-blue-500 hover:text-blue-600"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {(notifications as Notification[]).length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                (notifications as Notification[]).map((notification) => (
                  <motion.div
                    key={notification.id}
                    layout
                    className={`p-4 border-b last:border-b-0 ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`${!notification.read ? "font-medium" : ""}`}>
                          {notification.message}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-sm text-blue-500 hover:text-blue-600"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
