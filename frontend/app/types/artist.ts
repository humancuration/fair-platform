export interface ArtistGrowth {
  artistId: string;
  name: string;
  avatar: string;
  initialListeners: number;
  currentListeners: number;
  growthPercentage: number;
  firstFeatureDate: string;
  genres: string[];
}

export interface ArtistMetrics {
  monthlyListeners: number;
  totalStreams: number;
  averageEngagement: number;
  growthRate: number;
  collaborations: number;
  crossGenreAppeal: number;
}
