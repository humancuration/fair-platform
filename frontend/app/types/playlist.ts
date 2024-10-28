export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  coverArt?: string;
  waveformData?: number[];
  quantumSignature?: {
    resonance: number;
    entanglement: number[];
    harmonicField: number[];
  };
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  visibility: 'public' | 'private' | 'collaborative';
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  groupId?: string;
  mediaItems: MediaItem[];
  stats: PlaylistStats;
  settings: PlaylistSettings;
  contributors: Contributor[];
  title: string;
  tracks: Track[];
  isCollaborative: boolean;
  hasAICuration: boolean;
  isEducational: boolean;
  creatorId: string
}



export interface PlaylistStats {
  playCount: number;
  totalDuration: number;
  uniqueListeners: number;
  shareCount: number;
  likes: number;
  shares: number;
  listenerHistory: Array<{
    date: string;
    count: number;
  }>;
}

export interface PlaylistSettings {
  isPlaying: boolean;
  shuffleEnabled: boolean;
  repeatEnabled: boolean;
}

export interface Contributor {
  id: string;
  userId: string;
  playlistId: string;
  role: 'owner' | 'editor' | 'viewer';
  isActive: boolean;
  user: {
    name: string;
    avatar: string;
  };
}

export interface MediaItem {
  id: string;
  type: 'music' | 'video' | 'podcast';
  title: string;
  url: string;
  duration: number;
}
