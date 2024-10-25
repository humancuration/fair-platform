import { Socket } from 'socket.io-client';
import { toast } from 'react-toastify';

export interface PlaylistNotification {
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

class NotificationService {
  private socket: Socket | null = null;

  setSocket(socket: Socket) {
    this.socket = socket;
    this.setupListeners();
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on('notification:playlist', this.handlePlaylistNotification);
    this.socket.on('notification:error', this.handleError);
  }

  private handlePlaylistNotification = (notification: PlaylistNotification) => {
    const messages = {
      like: `${notification.username} liked your playlist "${notification.playlistName}"`,
      comment: `${notification.username} commented on "${notification.playlistName}"`,
      share: `${notification.username} shared your playlist "${notification.playlistName}"`,
      collaboration: `${notification.username} wants to collaborate on "${notification.playlistName}"`,
      addition: `${notification.username} added a track to "${notification.playlistName}"`,
      mention: `${notification.username} mentioned you in "${notification.playlistName}"`,
    };

    toast(messages[notification.type], {
      position: 'bottom-right',
      icon: this.getNotificationIcon(notification.type),
      onClick: () => this.handleNotificationClick(notification),
    });
  };

  private handleError = (error: string) => {
    toast.error(`Notification error: ${error}`);
  };

  private getNotificationIcon(type: string) {
    switch (type) {
      case 'like': return '❤️';
      case 'comment': return '💭';
      case 'share': return '🔄';
      case 'collaboration': return '👥';
      case 'addition': return '🎵';
      case 'mention': return '📢';
      default: return '🔔';
    }
  }

  private handleNotificationClick(notification: PlaylistNotification) {
    // Navigate to relevant section based on notification type
    switch (notification.type) {
      case 'comment':
        window.location.href = `/playlists/${notification.playlistId}#comments`;
        break;
      case 'collaboration':
        window.location.href = `/playlists/${notification.playlistId}#collaborate`;
        break;
      default:
        window.location.href = `/playlists/${notification.playlistId}`;
    }
  }

  subscribeToPlaylist(playlistId: string) {
    if (!this.socket) return;
    this.socket.emit('subscribe:playlist', playlistId);
  }

  unsubscribeFromPlaylist(playlistId: string) {
    if (!this.socket) return;
    this.socket.emit('unsubscribe:playlist', playlistId);
  }

  markAsRead(notificationId: string) {
    if (!this.socket) return;
    this.socket.emit('notification:markAsRead', notificationId);
  }

  async getUnreadCount(): Promise<number> {
    try {
      const response = await fetch('/api/notifications/unread/count');
      const data = await response.json();
      return data.count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }
}

export const notificationService = new NotificationService();
