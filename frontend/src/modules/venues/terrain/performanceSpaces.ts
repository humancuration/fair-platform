import { FaUsers, FaMusic, FaTheaterMasks, FaDrum, FaGuitar, FaMicrophone } from 'react-icons/fa';

export interface PerformanceSpace {
  id: string;
  name: string;
  type: 'intimate' | 'medium' | 'large' | 'ceremonial' | 'experimental';
  icon: any;
  capacity: {
    min: number;
    max: number;
    optimal: number;
  };
  acoustics: {
    reverberation: number; // 0-1
    bassResponse: number;
    clarity: number;
    intimacy: number;
  };
  features: string[];
  atmosphere: {
    lighting: string[];
    visualEffects: string[];
    spatialAudio: boolean;
  };
  culturalContext: string[];
  weatherCompatibility: string[];
}

export const performanceSpaces: Record<string, PerformanceSpace> = {
  intimateGarden: {
    id: 'garden',
    name: 'Intimate Garden',
    type: 'intimate',
    icon: FaMusic,
    capacity: {
      min: 10,
      max: 50,
      optimal: 30
    },
    acoustics: {
      reverberation: 0.3,
      bassResponse: 0.4,
      clarity: 0.9,
      intimacy: 1.0
    },
    features: [
      'natural-seating',
      'ambient-water-features',
      'plant-acoustics',
      'fairy-lights'
    ],
    atmosphere: {
      lighting: ['moonlight', 'lanterns', 'fireflies'],
      visualEffects: ['floating-petals', 'mist'],
      spatialAudio: true
    },
    culturalContext: ['zen-garden', 'secret-garden', 'meditation-space'],
    weatherCompatibility: ['clear', 'light-breeze', 'warm-evening']
  },

  communityCircle: {
    id: 'circle',
    name: 'Community Circle',
    type: 'medium',
    icon: FaDrum,
    capacity: {
      min: 50,
      max: 200,
      optimal: 120
    },
    acoustics: {
      reverberation: 0.5,
      bassResponse: 0.8,
      clarity: 0.7,
      intimacy: 0.8
    },
    features: [
      'circular-seating',
      'dance-area',
      'percussion-resonance',
      'communal-instruments'
    ],
    atmosphere: {
      lighting: ['bonfire', 'torch-light', 'star-light'],
      visualEffects: ['smoke-patterns', 'shadow-dance'],
      spatialAudio: true
    },
    culturalContext: ['tribal-gathering', 'drum-circle', 'storytelling-space'],
    weatherCompatibility: ['clear', 'warm', 'night']
  },

  ancientAmphitheater: {
    id: 'amphitheater',
    name: 'Ancient Amphitheater',
    type: 'large',
    icon: FaTheaterMasks,
    capacity: {
      min: 200,
      max: 2000,
      optimal: 800
    },
    acoustics: {
      reverberation: 0.7,
      bassResponse: 0.6,
      clarity: 0.8,
      intimacy: 0.5
    },
    features: [
      'natural-acoustics',
      'tiered-seating',
      'stage-platform',
      'ancient-architecture'
    ],
    atmosphere: {
      lighting: ['sunset-glow', 'stone-reflections', 'starlight'],
      visualEffects: ['natural-echoes', 'wind-harmonics'],
      spatialAudio: true
    },
    culturalContext: ['greek-theater', 'roman-venue', 'classical-space'],
    weatherCompatibility: ['clear', 'mild', 'evening']
  },

  sacredTemple: {
    id: 'temple',
    name: 'Sacred Temple',
    type: 'ceremonial',
    icon: FaGuitar,
    capacity: {
      min: 30,
      max: 300,
      optimal: 150
    },
    acoustics: {
      reverberation: 0.9,
      bassResponse: 0.7,
      clarity: 0.6,
      intimacy: 0.7
    },
    features: [
      'resonant-chambers',
      'sacred-geometry',
      'meditation-spaces',
      'ritual-areas'
    ],
    atmosphere: {
      lighting: ['filtered-sunlight', 'candlelight', 'dawn-light'],
      visualEffects: ['incense-patterns', 'light-beams'],
      spatialAudio: true
    },
    culturalContext: ['temple-music', 'sacred-chants', 'meditation-sounds'],
    weatherCompatibility: ['any-weather', 'indoor']
  },

  urbanWarehouse: {
    id: 'warehouse',
    name: 'Urban Warehouse',
    type: 'experimental',
    icon: FaMicrophone,
    capacity: {
      min: 100,
      max: 1000,
      optimal: 500
    },
    acoustics: {
      reverberation: 0.8,
      bassResponse: 1.0,
      clarity: 0.5,
      intimacy: 0.4
    },
    features: [
      'modular-staging',
      'industrial-aesthetics',
      'projection-mapping',
      'sound-system'
    ],
    atmosphere: {
      lighting: ['led-arrays', 'laser-systems', 'strobes'],
      visualEffects: ['projection-mapping', 'fog-effects', 'light-shows'],
      spatialAudio: true
    },
    culturalContext: ['underground-scene', 'electronic-music', 'avant-garde'],
    weatherCompatibility: ['indoor', 'any-weather']
  },

  floatingPlatform: {
    id: 'floating',
    name: 'Floating Platform',
    type: 'experimental',
    icon: FaMusic,
    capacity: {
      min: 50,
      max: 500,
      optimal: 200
    },
    acoustics: {
      reverberation: 0.4,
      bassResponse: 0.9,
      clarity: 0.7,
      intimacy: 0.6
    },
    features: [
      'water-acoustics',
      'floating-stage',
      'surrounding-boats',
      'water-reflections'
    ],
    atmosphere: {
      lighting: ['water-reflections', 'floating-lights', 'moonlight'],
      visualEffects: ['water-mist', 'light-ripples'],
      spatialAudio: true
    },
    culturalContext: ['water-festival', 'harbor-concert', 'river-music'],
    weatherCompatibility: ['clear', 'calm-water', 'sunset']
  }
};

export const getOptimalSpaceForPerformance = (
  attendees: number,
  style: string,
  weatherCondition: string
): PerformanceSpace[] => {
  return Object.values(performanceSpaces)
    .filter(space => 
      space.capacity.min <= attendees &&
      space.capacity.max >= attendees &&
      space.weatherCompatibility.includes(weatherCondition)
    )
    .sort((a, b) => {
      // Calculate suitability score
      const getScore = (space: PerformanceSpace) => {
        let score = 0;
        // Optimal capacity match
        score += 1 - Math.abs(attendees - space.capacity.optimal) / space.capacity.optimal;
        // Cultural context match
        if (space.culturalContext.some(context => context.includes(style))) {
          score += 0.5;
        }
        return score;
      };
      return getScore(b) - getScore(a);
    });
};

export const calculateAcousticProperties = (
  space: PerformanceSpace,
  weather: string,
  attendance: number
): { quality: number; recommendations: string[] } => {
  let quality = 0;
  const recommendations: string[] = [];

  // Base acoustic quality
  quality += space.acoustics.clarity * 0.3;
  quality += space.acoustics.reverberation * 0.3;
  quality += space.acoustics.intimacy * 0.2;
  quality += space.acoustics.bassResponse * 0.2;

  // Weather adjustments
  if (weather === 'rain' && !space.weatherCompatibility.includes('indoor')) {
    quality *= 0.7;
    recommendations.push('Consider indoor alternative during rain');
  }

  // Attendance impact
  const occupancyRate = attendance / space.capacity.optimal;
  if (occupancyRate < 0.5) {
    quality *= 0.8;
    recommendations.push('Consider smaller space for better atmosphere');
  } else if (occupancyRate > 1.2) {
    quality *= 0.9;
    recommendations.push('Space might be too crowded for optimal acoustics');
  }

  return { quality, recommendations };
};
