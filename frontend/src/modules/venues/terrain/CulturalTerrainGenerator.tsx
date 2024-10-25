import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaGlobe, FaMusic, FaTree, FaMountain, FaWater, FaPalette } from 'react-icons/fa';
import SimplexNoise from 'simplex-noise';

interface CulturalZone {
  id: string;
  name: string;
  origin: string;
  influences: string[];
  musicStyle: string[];
  terrain: {
    elevation: number;
    vegetation: number;
    water: number;
  };
  atmosphere: {
    ambientSounds: string[];
    lightingStyle: string;
    weatherPatterns: string[];
  };
  landmarks: {
    type: 'natural' | 'architectural' | 'artistic';
    name: string;
    description: string;
    position: [number, number, number];
  }[];
}

interface TerrainCell {
  elevation: number;
  culturalInfluence: string[];
  biome: string;
  flowField: [number, number]; // For crowd movement simulation
  soundPropagation: number;
}

const TerrainContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
`;

const TerrainGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
  margin-top: 20px;
`;

const TerrainCell = styled(motion.div)<{ elevation: number; cultures: string[] }>`
  aspect-ratio: 1;
  background: ${({ elevation, cultures }) => `
    linear-gradient(
      45deg,
      ${cultures.map((c, i) => `${getCultureColor(c)} ${(i * 100) / cultures.length}%`).join(', ')}
    )
  `};
  opacity: ${({ elevation }) => 0.3 + elevation * 0.7};
  border-radius: 8px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ elevation }) => `
      linear-gradient(
        to bottom,
        transparent,
        rgba(0, 0, 0, ${elevation * 0.5})
      )
    `};
  }
`;

const CulturalTerrainGenerator: React.FC = () => {
  const [terrain, setTerrain] = useState<TerrainCell[][]>([]);
  const [culturalZones, setCulturalZones] = useState<CulturalZone[]>([]);
  const [noise] = useState(() => new SimplexNoise());

  useEffect(() => {
    generateTerrain();
  }, []);

  const generateTerrain = () => {
    const size = 32;
    const newTerrain: TerrainCell[][] = [];
    
    // Generate base terrain using noise
    for (let y = 0; y < size; y++) {
      const row: TerrainCell[] = [];
      for (let x = 0; x < size; x++) {
        const elevation = (noise.noise2D(x * 0.1, y * 0.1) + 1) / 2;
        row.push({
          elevation,
          culturalInfluence: [],
          biome: getBiome(elevation),
          flowField: [0, 0],
          soundPropagation: 1
        });
      }
      newTerrain.push(row);
    }

    // Add cultural influence zones
    culturalZones.forEach(zone => {
      const center = getZoneCenter(zone);
      const radius = Math.random() * 10 + 5;

      // Create cultural diffusion
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const distance = getDistance([x, y], center);
          if (distance < radius) {
            const influence = 1 - (distance / radius);
            newTerrain[y][x].culturalInfluence.push(zone.origin);
            
            // Modify terrain based on cultural preferences
            modifyTerrainForCulture(newTerrain[y][x], zone);
          }
        }
      }
    });

    // Create fusion zones where cultures meet
    createFusionZones(newTerrain);
    
    setTerrain(newTerrain);
  };

  const createFusionZones = (terrain: TerrainCell[][]) => {
    const size = terrain.length;
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const cell = terrain[y][x];
        if (cell.culturalInfluence.length > 1) {
          // Create special properties for fusion zones
          cell.soundPropagation *= 1.2; // Better acoustics in fusion zones
          
          // Add unique landmarks or features
          if (Math.random() < 0.1) {
            addFusionLandmark(x, y, cell.culturalInfluence);
          }
        }
      }
    }
  };

  const addFusionLandmark = (x: number, y: number, cultures: string[]) => {
    const landmark = {
      type: 'architectural' as const,
      name: `${cultures.join('-')} Fusion Stage`,
      description: `A unique performance space celebrating the fusion of ${cultures.join(' and ')} music`,
      position: [x, terrain[y][x].elevation * 10, y]
    };

    // Add to nearest cultural zone
    const nearestZone = findNearestCulturalZone([x, y]);
    if (nearestZone) {
      nearestZone.landmarks.push(landmark);
    }
  };

  const modifyTerrainForCulture = (cell: TerrainCell, zone: CulturalZone) => {
    // Modify terrain based on cultural preferences
    switch (zone.musicStyle[0]) {
      case 'mountain':
        cell.elevation *= 1.2;
        break;
      case 'coastal':
        cell.elevation *= 0.8;
        break;
      case 'forest':
        cell.biome = 'forest';
        break;
      // Add more cultural terrain modifications
    }
  };

  const getBiome = (elevation: number): string => {
    if (elevation > 0.8) return 'mountain';
    if (elevation > 0.6) return 'hills';
    if (elevation > 0.3) return 'plains';
    return 'water';
  };

  return (
    <TerrainContainer>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaGlobe /> Cultural Terrain Generator
        </h2>
        <button
          onClick={generateTerrain}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
        >
          Regenerate Terrain
        </button>
      </div>

      <TerrainGrid>
        {terrain.map((row, y) => (
          <div key={y} className="flex">
            {row.map((cell, x) => (
              <TerrainCell
                key={`${x}-${y}`}
                elevation={cell.elevation}
                cultures={cell.culturalInfluence}
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: (x + y) * 0.01 }}
              >
                {cell.culturalInfluence.length > 1 && (
                  <div className="absolute inset-0 bg-white opacity-20" />
                )}
              </TerrainCell>
            ))}
          </div>
        ))}
      </TerrainGrid>

      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Cultural Zones</h3>
        <div className="flex flex-wrap gap-2">
          {culturalZones.map(zone => (
            <motion.div
              key={zone.id}
              className="bg-opacity-10 bg-white rounded-lg p-3"
              whileHover={{ scale: 1.05 }}
            >
              <h4 className="font-semibold">{zone.name}</h4>
              <p className="text-sm opacity-70">
                {zone.musicStyle.join(', ')}
              </p>
              <div className="flex gap-2 mt-2">
                {zone.landmarks.map(landmark => (
                  <span
                    key={landmark.name}
                    className="text-xs bg-opacity-20 bg-white px-2 py-1 rounded-full"
                  >
                    {landmark.name}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </TerrainContainer>
  );
};

export default CulturalTerrainGenerator;
