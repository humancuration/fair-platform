export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar?: string;
  bio?: string;
  timezone: string;
  points: number;
  notificationsEnabled: boolean;
  theme: string;
  fediverseProfile?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  isPublic: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  tracks?: Track[];
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverArt: string;
  duration: number;
  visualizerType: 'bars' | 'circles' | 'waves';
  genre: string;
  bpm: number;
  playlistId?: string;
  createdAt: Date;
  updatedAt: Date;
  playlist?: Playlist;
  moodAnalysis?: MoodAnalysis;
}

// Add other model types as needed...
