import { FairVenueSpace } from '../types/FairVenueTypes';

export const fairSpaces: Record<string, FairVenueSpace> = {
  learningCommons: {
    id: 'learning-commons',
    name: 'Global Learning Commons',
    type: 'learning',
    accessibility: {
      languages: ['en', 'es', 'fr', 'ar', 'zh', 'hi'],
      captioning: true,
      signLanguageSupport: true,
      screenReaderOptimized: true,
      lowBandwidthMode: true
    },
    collaborationFeatures: {
      peerLearning: true,
      mentorship: true,
      resourceSharing: true,
      skillExchange: true
    },
    capacity: {
      min: 5,
      max: 1000,
      optimal: 100,
      dynamicScaling: true
    },
    resources: {
      computePower: 100,
      storageSpace: 1000,
      bandwidth: 500
    },
    contributionMechanisms: {
      knowledgeSharing: true,
      codeContribution: true,
      teaching: true,
      mentoring: true,
      translation: true
    },
    rewardSystem: {
      learningPoints: true,
      teachingCredits: true,
      communityTokens: true,
      skillBadges: true
    }
  }
  // Add more spaces...
};