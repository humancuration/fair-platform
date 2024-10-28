export interface EarningMetrics {
  totalEarned: number;
  listenerMinutes: number;
  uniqueListeners: number;
  artistSupport: {
    directSupport: number;
    streamingRoyalties: number;
    merchandiseSales: number;
  };
  curatorMetrics: {
    playlistFollowers: number;
    averageListenTime: number;
    retentionRate: number;
    genreAccuracy: number;
  };
  transparencyScore: number;
  ethicalScore: number;
}

export interface SupportedArtist {
  id: string;
  name: string;
  supportAmount: number;
  listenerGrowth: number;
  isVerified: boolean;
  platformShare: number;
}

export interface MonetizationStats {
  dailyEarnings: number[];
  supportDistribution: {
    category: string;
    amount: number;
  }[];
  platformFees: number;
  artistRevenue: number;
  curatorRevenue: number;
}
