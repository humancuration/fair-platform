import { useState } from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaBell, FaComment, FaHeart, FaRetweet, FaUserPlus, 
  FaEnvelope, FaAt, FaHashtag 
} from "react-icons/fa";
import { PleromaActivityHandler } from "~/services/activitypub/handlers/pleroma.server";

interface PleromaNotification {
  id: string;
  type: 'mention' | 'reblog' | 'favourite' | 'follow' | 'chat' | 'emoji_reaction';
  account: {
    id: string;
    username: string;
    display_name: string;
    avatar: string;
  };
  status?: {
    id: string;
    content: string;
    emojis: Array<{
      shortcode: string;
      url: string;
    }>;
  };
  emoji?: string;
  created_at: string;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const excludeTypes = url.searchParams.get("exclude_types")?.split(",") || [];
  
  const notifications = await db.notification.findMany({
    where: {
      type: { notIn: excludeTypes },
    },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return json({ notifications });
};

export function PleromaNotifications() {
  const { notifications } = useLoaderData<typeof loader>();
  const [filter, setFilter] = useState<PleromaNotification["type"] | "all">("all");

  const getIcon = (type: PleromaNotification["type"]) => {
    switch (type) {
      case "mention":
        return <FaAt className="text-blue-400" />;
      case "reblog":
        return <FaRetweet className="text-green-400" />;
      case "favourite":
        return <FaHeart className="text-red-400" />;
      case "follow":
        return <FaUserPlus className="text-purple-400" />;
      case "chat":
        return <FaEnvelope className="text-yellow-400" />;
      case "emoji_reaction":
        return <FaHashtag className="text-pink-400" />;
      default:
        return <FaBell className="text-gray-400" />;
    }
  };

  const filteredNotifications = filter === "all" 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaBell /> Notifications
        </h2>
        <div className="flex gap-2">
          {["all", "mention", "reblog", "favourite", "follow", "chat", "emoji_reaction"].map((type) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setFilter(type as PleromaNotification["type"] | "all")}
              className={`p-2 rounded-lg ${
                filter === type ? "bg-purple-500" : "bg-white/10"
              }`}
              title={type.charAt(0).toUpperCase() + type.slice(1)}
            >
              {getIcon(type as PleromaNotification["type"])}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {filteredNotifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/5 rounded-lg p-4 mb-3"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-full">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src={notification.account.avatar}
                    alt={notification.account.display_name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="font-semibold">
                    {notification.account.display_name}
                  </span>
                  <span className="text-sm opacity-60">
                    @{notification.account.username}
                  </span>
                </div>
                {notification.status && (
                  <p className="text-sm opacity-90">{notification.status.content}</p>
                )}
                {notification.emoji && (
                  <div className="text-2xl mt-1">{notification.emoji}</div>
                )}
                <span className="text-xs opacity-60 mt-2 block">
                  {new Date(notification.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
