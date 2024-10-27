export interface FairVenueSpace {
  id: string;
  name: string;
  type: 'learning' | 'collaboration' | 'performance' | 'community' | 'research';
  accessibility: {
    languages: string[];
    captioning: boolean;
    signLanguageSupport: boolean;
    screenReaderOptimized: boolean;
    lowBandwidthMode: boolean;
  };
  collaborationFeatures: {
    peerLearning: boolean;
    mentorship: boolean;
    resourceSharing: boolean;
    skillExchange: boolean;
  };
  capacity: {
    min: number;
    max: number;
    optimal: number;
    dynamicScaling: boolean;
  };
  resources: {
    computePower: number; // Shared compute resources
    storageSpace: number; // Shared storage
    bandwidth: number;
  };
  contributionMechanisms: {
    knowledgeSharing: boolean;
    codeContribution: boolean;
    teaching: boolean;
    mentoring: boolean;
    translation: boolean;
  };
  rewardSystem: {
    learningPoints: boolean;
    teachingCredits: boolean;
    communityTokens: boolean;
    skillBadges: boolean;
  };
}