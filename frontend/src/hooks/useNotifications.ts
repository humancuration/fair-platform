import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';
import { notificationService, PlaylistNotification } from '../services/NotificationService';

export const useNotifications = (playlistId?: string) => {
  const [notifications, setNotifications] = useState<PlaylistNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket } = useWebSocket();

  useEffect(() => {
    if (socket) {
      notificationService.setSocket(socket);
    }
  }, [socket]);

  useEffect(() => {
    if (playlistId) {
      notificationService.subscribeToPlaylist(playlistId);
      return () => {
        notificationService.unsubscribeFromPlaylist(playlistId);
      };
    }
  }, [playlistId]);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    };

    fetchUnreadCount();
  }, []);

  const markAsRead = async (notificationId: string) => {
    await notificationService.markAsRead(notificationId);
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
  };
};
