import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaUserFriends, FaHeart, FaComment, FaShare, FaPlus } from 'react-icons/fa';
import { useNotification } from '../../../hooks/useNotification';
import { useWebSocket } from '../../../hooks/useWebSocket';

interface PlaylistNotification {
  id: string;
  type: 'like' | 'comment' | 'share' | 'collaboration' | 'addition' | 'mention';
  playlistId: string;
  playlistName: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  read: boolean;
}

const NotificationContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  margin-top: 20px;
`;

const NotificationBadge = styled(motion.div)`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff6b6b;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

const NotificationItem = styled(motion.div)<{ read: boolean }>`
  background: ${({ read }) => read ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const IconWrapper = styled.div<{ type: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ type }) => {
    switch (type) {
      case 'like': return 'linear-gradient(45deg, #ff6b6b, #ff8787)';
      case 'comment': return 'linear-gradient(45deg, #4facfe, #00f2fe)';
      case 'share': return 'linear-gradient(45deg, #43cea2, #185a9d)';
      case 'collaboration': return 'linear-gradient(45deg, #a18cd1, #fbc2eb)';
      case 'addition': return 'linear-gradient(45deg, #fad961, #f76b1c)';
      case 'mention': return 'linear-gradient(45deg, #fa709a, #fee140)';
      default: return 'linear-gradient(45deg, #8e2de2, #4a00e0)';
    }
  }};
`;

const PlaylistNotifications: React.FC<{ playlistId: string }> = ({ playlistId }) => {
  const [notifications, setNotifications] = useState<PlaylistNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { notifyInfo } = useNotification();
  const socket = useWebSocket();

  useEffect(() => {
    fetchNotifications();
    setupWebSocket();
  }, [playlistId]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/playlists/${playlistId}/notifications`);
      const data = await response.json();
      setNotifications(data);
      updateUnreadCount(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const setupWebSocket = () => {
    if (!socket) return;

    socket.on(`playlist:${playlistId}:notification`, (notification: PlaylistNotification) => {
      setNotifications(prev => [notification, ...prev]);
      updateUnreadCount([notification, ...notifications]);
      showNotificationToast(notification);
    });

    return () => {
      socket.off(`playlist:${playlistId}:notification`);
    };
  };

  const updateUnreadCount = (notifs: PlaylistNotification[]) => {
    const count = notifs.filter(n => !n.read).length;
    setUnreadCount(count);
  };

  const showNotificationToast = (notification: PlaylistNotification) => {
    const messages = {
      like: `${notification.username} liked your playlist`,
      comment: `${notification.username} commented: "${notification.content}"`,
      share: `${notification.username} shared your playlist`,
      collaboration: `${notification.username} wants to collaborate`,
      addition: `${notification.username} added a track`,
      mention: `${notification.username} mentioned you`,
    };

    notifyInfo(messages[notification.type]);
  };

  const handleNotificationClick = async (notification: PlaylistNotification) => {
    if (!notification.read) {
      try {
        await fetch(`/api/notifications/${notification.id}/read`, { method: 'POST' });
        setNotifications(prev =>
          prev.map(n =>
            n.id === notification.id ? { ...n, read: true } : n
          )
        );
        updateUnreadCount(notifications.map(n =>
          n.id === notification.id ? { ...n, read: true } : n
        ));
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }

    // Handle navigation or action based on notification type
    switch (notification.type) {
      case 'comment':
        // Scroll to comment
        break;
      case 'collaboration':
        // Open collaboration modal
        break;
      // Add other cases as needed
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return <FaHeart />;
      case 'comment': return <FaComment />;
      case 'share': return <FaShare />;
      case 'collaboration': return <FaUserFriends />;
      case 'addition': return <FaPlus />;
      case 'mention': return <FaBell />;
      default: return <FaBell />;
    }
  };

  return (
    <NotificationContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaBell /> Notifications
          {unreadCount > 0 && (
            <NotificationBadge
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              {unreadCount}
            </NotificationBadge>
          )}
        </h2>
      </div>

      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            read={notification.read}
            onClick={() => handleNotificationClick(notification)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            layout
          >
            <IconWrapper type={notification.type}>
              {getNotificationIcon(notification.type)}
            </IconWrapper>
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
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </NotificationItem>
        ))}
      </AnimatePresence>
    </NotificationContainer>
  );
};

export default PlaylistNotifications;
