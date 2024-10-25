import { FaTree, FaMountain, FaWater, FaDrum, FaGuitar, FaCity, FaUmbrellaBeach, FaTemple } from 'react-icons/fa';

export interface CulturalBiome {
  id: string;
  name: string;
  description: string;
  icon: any; // React icon component
  musicStyles: string[];
  terrain: {
    baseElevation: number;
    roughness: number;
    waterLevel: number;
    vegetation: number;
  };
  atmosphere: {
    ambientSounds: string[];
    lightingStyle: string;
    weatherPatterns: string[];
    reverberation: number; // Natural acoustics
  };
  architecture: {
    style: string;
    materials: string[];
    landmarks: string[];
  };
  performanceSpaces: {
    type: string;
    capacity: number;
    acousticProperties: string[];
  }[];
}

export const culturalBiomes: Record<string, CulturalBiome> = {
  andeanHighlands: {
    id: 'andean',
    name: 'Andean Highlands',
    description: 'High-altitude plateaus with ancient stone structures',
    icon: FaMountain,
    musicStyles: ['panflute', 'charango', 'andean-folk'],
    terrain: {
      baseElevation: 0.8,
      roughness: 0.7,
      waterLevel: 0.3,
      vegetation: 0.4
    },
    atmosphere: {
      ambientSounds: ['wind-whistling', 'condor-calls', 'mountain-streams'],
      lightingStyle: 'crisp-mountain-light',
      weatherPatterns: ['clear-cold', 'mountain-mist', 'light-snow'],
      reverberation: 0.8
    },
    architecture: {
      style: 'inca-stonework',
      materials: ['stone', 'thatch', 'wood'],
      landmarks: ['stone-amphitheater', 'terraced-gardens', 'mountain-shrine']
    },
    performanceSpaces: [
      {
        type: 'stone-circle',
        capacity: 500,
        acousticProperties: ['natural-amplification', 'mountain-echo']
      }
    ]
  },

  mediterraneanCoast: {
    id: 'mediterranean',
    name: 'Mediterranean Coast',
    description: 'Sun-drenched coastal regions with ancient plazas',
    icon: FaUmbrellaBeach,
    musicStyles: ['flamenco', 'rebetiko', 'tarantella'],
    terrain: {
      baseElevation: 0.3,
      roughness: 0.4,
      waterLevel: 0.6,
      vegetation: 0.5
    },
    atmosphere: {
      ambientSounds: ['waves', 'seabirds', 'evening-cicadas'],
      lightingStyle: 'golden-hour',
      weatherPatterns: ['sea-breeze', 'clear-sunny', 'warm-evening'],
      reverberation: 0.6
    },
    architecture: {
      style: 'mediterranean-classical',
      materials: ['marble', 'limestone', 'terracotta'],
      landmarks: ['coastal-amphitheater', 'plaza-mayor', 'harbor-stage']
    },
    performanceSpaces: [
      {
        type: 'plaza',
        capacity: 300,
        acousticProperties: ['intimate-resonance', 'stone-reflection']
      }
    ]
  },

  westAfricanSavanna: {
    id: 'westafrican',
    name: 'West African Savanna',
    description: 'Rolling grasslands with ancient baobab groves',
    icon: FaDrum,
    musicStyles: ['djembe', 'kora', 'talking-drum'],
    terrain: {
      baseElevation: 0.4,
      roughness: 0.3,
      waterLevel: 0.2,
      vegetation: 0.6
    },
    atmosphere: {
      ambientSounds: ['savanna-wind', 'distant-drums', 'bird-calls'],
      lightingStyle: 'warm-sunset',
      weatherPatterns: ['dry-season', 'harmattan', 'thunder-season'],
      reverberation: 0.4
    },
    architecture: {
      style: 'traditional-west-african',
      materials: ['adobe', 'thatch', 'wood'],
      landmarks: ['drum-circle', 'storyteller-grove', 'community-gathering-space']
    },
    performanceSpaces: [
      {
        type: 'sacred-grove',
        capacity: 200,
        acousticProperties: ['natural-acoustics', 'open-air-clarity']
      }
    ]
  },

  japaneseForest: {
    id: 'japanese',
    name: 'Japanese Forest',
    description: 'Misty bamboo forests with traditional spaces',
    icon: FaTemple,
    musicStyles: ['shakuhachi', 'koto', 'taiko'],
    terrain: {
      baseElevation: 0.5,
      roughness: 0.6,
      waterLevel: 0.5,
      vegetation: 0.8
    },
    atmosphere: {
      ambientSounds: ['bamboo-rustling', 'temple-bells', 'mountain-stream'],
      lightingStyle: 'forest-filtered',
      weatherPatterns: ['gentle-rain', 'morning-mist', 'cherry-blossom-wind'],
      reverberation: 0.7
    },
    architecture: {
      style: 'traditional-japanese',
      materials: ['wood', 'paper', 'stone'],
      landmarks: ['zen-garden', 'temple-stage', 'forest-clearing']
    },
    performanceSpaces: [
      {
        type: 'temple-courtyard',
        capacity: 150,
        acousticProperties: ['zen-silence', 'natural-harmony']
      }
    ]
  },

  urbanUnderground: {
    id: 'urban',
    name: 'Urban Underground',
    description: 'Modern urban spaces with industrial character',
    icon: FaCity,
    musicStyles: ['electronic', 'hip-hop', 'experimental'],
    terrain: {
      baseElevation: 0.2,
      roughness: 0.8,
      waterLevel: 0.1,
      vegetation: 0.2
    },
    atmosphere: {
      ambientSounds: ['city-pulse', 'subway-rhythm', 'street-sounds'],
      lightingStyle: 'neon-glow',
      weatherPatterns: ['night-lights', 'city-rain', 'electric-storm'],
      reverberation: 0.9
    },
    architecture: {
      style: 'industrial-modern',
      materials: ['concrete', 'steel', 'glass'],
      landmarks: ['warehouse-venue', 'rooftop-stage', 'underground-club']
    },
    performanceSpaces: [
      {
        type: 'converted-warehouse',
        capacity: 1000,
        acousticProperties: ['industrial-reverb', 'bass-enhancement']
      }
    ]
  }
};

export const getBiomeColor = (biomeId: string): string => {
  const colors = {
    andean: '#A1887F',
    mediterranean: '#90CAF9',
    westafrican: '#FFB74D',
    japanese: '#A5D6A7',
    urban: '#9575CD'
  };
  return colors[biomeId as keyof typeof colors] || '#808080';
};

export const calculateBiomeCompatibility = (biome1: string, biome2: string): number => {
  // Calculate how well two biomes blend together (0-1)
  const compatibilityMatrix: Record<string, Record<string, number>> = {
    andean: {
      mediterranean: 0.6,
      westafrican: 0.4,
      japanese: 0.7,
      urban: 0.3
    },
    mediterranean: {
      andean: 0.6,
      westafrican: 0.5,
      japanese: 0.6,
      urban: 0.4
    },
    // Add more compatibility scores...
  };

  return compatibilityMatrix[biome1]?.[biome2] || 0.5;
};

export const generateBiomeTransition = (
  biome1: CulturalBiome,
  biome2: CulturalBiome,
  position: number // 0-1, where in the transition
): Partial<CulturalBiome> => {
  // Create smooth transitions between biomes
  return {
    terrain: {
      baseElevation: lerp(biome1.terrain.baseElevation, biome2.terrain.baseElevation, position),
      roughness: lerp(biome1.terrain.roughness, biome2.terrain.roughness, position),
      waterLevel: lerp(biome1.terrain.waterLevel, biome2.terrain.waterLevel, position),
      vegetation: lerp(biome1.terrain.vegetation, biome2.terrain.vegetation, position)
    },
    atmosphere: {
      reverberation: lerp(biome1.atmosphere.reverberation, biome2.atmosphere.reverberation, position)
    }
  };
};

const lerp = (start: number, end: number, amt: number): number => {
  return (1 - amt) * start + amt * end;
};
