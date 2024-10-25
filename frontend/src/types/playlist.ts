export interface MediaItem {
  id: string;
  type: 'music' | 'video' | 'social' | 'podcast';
  title: string;
  url: string;
  artwork?: string;
  artist?: string;
  duration?: number;
  waveformData?: number[];
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  mediaItems: MediaItem[];
  ownerId: string;
  groupId?: string;
  createdAt: string;
  artwork?: string;
  isPublic: boolean;
  tags: string[];
  totalDuration: number;
  playCount: number;
  collaborators?: string[];
  mood?: {
    energy: number;
    danceability: number;
    valence: number;
  };
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
