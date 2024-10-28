export interface VotingPower {
  base: number;
  reputation: number;
  specialization: number;
  timeWeight: number;
  total: number;
}

export interface VoteHistory {
  id: string;
  timestamp: string;
  type: 'spot' | 'curator' | 'policy';
  target: string;
  power: number;
  pattern: {
    timeVariance: number;
    distributionPattern: string;
    correlationScore: number;
  };
}

export interface AIVoterRegistration {
  id: string;
  ownerId: string;
  specializations: string[];
  independenceScore: number;
  verificationLevel: number;
  behaviorPattern: {
    decisionLatency: number;
    voteDistribution: number[];
    crossValidation: number;
  };
}

export interface VotingAnalytics {
  participationRate: number;
  consensusRate: number;
  averageVotingPower: number;
  topVoters: {
    id: string;
    power: number;
    accuracy: number;
  }[];
  recentDecisions: {
    id: string;
    outcome: string;
    support: number;
    impact: number;
  }[];
}

export interface VotingRights {
  canVote: boolean;
  restrictions: string[];
  cooldownPeriod: number;
  requiredStake: number;
  specialPrivileges: string[];
}
