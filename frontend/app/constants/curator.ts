export const CURATOR = {
  TYPES: ['ai', 'human', 'hybrid'] as const,
  FILTERS: ['all', 'trending', 'ai', 'human', 'hybrid'] as const,
  METRICS: {
    MIN_TRUST_SCORE: 0,
    MAX_TRUST_SCORE: 100,
    MIN_VOTING_POWER: 0,
  },
} as const;
