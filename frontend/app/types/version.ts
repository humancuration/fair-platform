export interface PlaylistVersion {
  id: string;
  playlistId: string;
  parentVersionId?: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    type: 'human' | 'ai';
    avatar: string;
  };
  changes: {
    added: string[];
    removed: string[];
    reordered: boolean;
  };
  metadata: {
    aiGenerated?: boolean;
    confidence?: number;
    reason?: string;
    mood?: {
      energy: number;
      danceability: number;
      valence: number;
    };
  };
}

export interface PlaylistFork {
  id: string;
  name: string;
  description: string;
  originalPlaylistId: string;
  forkedFrom: {
    id: string;
    name: string;
    owner: {
      username: string;
      avatar: string;
    };
  };
  divergencePoint: string;
  stats: {
    tracksAdded: number;
    tracksRemoved: number;
    totalChanges: number;
  };
}
