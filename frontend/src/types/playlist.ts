export type MediaItemType = "video" | "social" | "music" | "podcast";

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  type: MediaItemType;
  duration: number;
  thumbnail?: string;
  artist?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  mediaItems: MediaItem[];
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
}

export interface PlaylistStats {
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  uniqueListeners: number;
  peakListeners: number;
  averageListenTime: number;
  topCountries: Array<{
    country: string;
    listeners: number;
  }>;
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
}

export interface PlaylistContextState {
  currentPlaylist: Playlist | null;
  currentTrackIndex: number;
  isPlaying: boolean;
  queue: MediaItem[];
}

export type PlaylistAction = 
  | { type: 'SET_PLAYLIST'; payload: Playlist }
  | { type: 'SET_TRACK_INDEX'; payload: number }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'ADD_TO_QUEUE'; payload: MediaItem }
  | { type: 'REMOVE_FROM_QUEUE'; payload: number }
  | { type: 'CLEAR_QUEUE' };

export interface CreatePlaylistData {
  title: string;
  description?: string;
  isPublic?: boolean;
  mediaItems?: string[];
}
