export interface EcoAnalyticsData {
  timeline: {
    date: string;
    communitySavings: number;
    carbonOffset: number;
    resourcesShared: number;
  }[];
  impact: {
    education: number;
    infrastructure: number;
    research: number;
    communityProjects: number;
  };
  totalCarbonOffset: number;
  totalSavings: number;
  resourcesShared: number;
}

export interface EcoTip {
  id: string;
  title: string;
  description: string;
  category: string;
  impact?: string;
  imageUrl?: string;
  likes: number;
  author: string;
}

export interface GroupEcoData {
  id: string;
  name: string;
  carbonOffset: number;
  resourcesShared: number;
  memberCount: number;
  projectCount: number;
  impactScore: number;
} 