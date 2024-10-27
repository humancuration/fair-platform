export interface CommunityStats {
  helpfulActions: number;
  peopleReached: number;
  languagesSupported: string[];
  culturalExchanges: number;
  eventParticipation: number;
  knowledgeShared: {
    topics: number;
    resources: number;
    translations: number;
  };
  communityGrowth: {
    newConnections: number;
    collaborations: number;
    mentorships: number;
  };
}

export interface Contribution {
  id: string;
  type: 'comment' | 'review' | 'help' | 'event' | 'translation' | 'mentorship';
  content: string;
  impact: number;
  timestamp: string;
  recipientCount: number;
  languages?: string[];
  category?: string;
  userId: string;
}

export interface ImpactArea {
  icon: string;
  title: string;
  description: string;
  count: number;
}
