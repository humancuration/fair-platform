export interface SocialStats {
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  isLiked: boolean;
  isSaved: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
}

export interface NotificationPreference {
  email: boolean;
  push: boolean;
  inApp: boolean;
}

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
