export type CuratorType = 'ai' | 'human' | 'hybrid';
export type CuratorFilter = 'all' | CuratorType | 'trending';

export interface CuratorBadge {
  type: string;
  label: string;
  description: string;
}

export interface CuratorStats {
  monthlyListeners: number;
  curatorScore: number;
  followers: number;
  playlists: number;
}

export interface Curator {
  id: string;
  name: string;
  type: CuratorType;
  avatar: string;
  bio: string;
  curatorScore: number;
  badges: CuratorBadge[];
  stats: CuratorStats;
  expertise: string[];
  votingPower: number;
  delegatedPower: number;
  trustScore: number;
  specializations: {
    genre: string;
    score: number;
  }[];
}

export interface CuratorMetrics {
  totalListeners: number;
  uniqueArtistsPromoted: number;
  crossGenreCollaborations: number;
  listenerRetention: number;
  geographicReach: {
    countries: number;
    topRegions: {
      name: string;
      listeners: number;
    }[];
  };
}

export interface Delegate {
  id: string;
  name: string;
  type: CuratorType;
  avatar: string;
  expertise: string[];
  votingPower: number;
  delegatedPower: number;
  trustScore: number;
  delegators: number;
  specializations: {
    genre: string;
    score: number;
  }[];
  recentDecisions: {
    type: string;
    outcome: string;
    support: number;
    timestamp: string;
  }[];
}

export interface DelegationMetrics {
  totalDelegates: number;
  activeDelegations: number;
  averageTrustScore: number;
  topGenres: {
    genre: string;
    delegates: number;
  }[];
  delegationChains: {
    length: number;
    count: number;
  }[];
}
