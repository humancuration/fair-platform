export type CuratorType = 'ai' | 'human' | 'hybrid';
export type CuratorFilter = 'all' | CuratorType | 'trending';
export type SortBy = 'rating' | 'followers' | 'innovative' | 'default';

export interface Curator {
  id: string;
  name: string;
  type: CuratorType;
  avatar: string;
  bio: string;
  stats: CuratorStats;
  specialties: string[];
  recentPlaylists: PlaylistPreview[];
  curatorScore: number;
  badges: Badge[];
  aiFeatures?: AIFeatures;
}

export interface CuratorStats {
  followers: number;
  totalPlaylists: number;
  averageRating: number;
  monthlyListeners: number;
  innovationScore?: number;
}

export interface Badge {
  type: string;
  label: string;
  description: string;
}

export interface AIFeatures {
  modelType: string;
  capabilities: string[];
  trustScore: number;
  verificationStatus: 'verified' | 'experimental' | 'learning';
}

export interface PlaylistPreview {
  id: string;
  name: string;
  likes: number;
  plays: number;
}
