export const MUSIC = {
  VISUALIZER: {
    TYPES: ['bars', 'circles', 'waves'] as const,
    FFT_SIZE: 256,
    UPDATE_INTERVAL: 16, // ~60fps
  },
  CROSSFADE: {
    DURATION: 2000, // ms
  },
  VOLUME: {
    DEFAULT: 0.5,
    MAX: 1.0,
    MIN: 0.0,
  },
} as const;
