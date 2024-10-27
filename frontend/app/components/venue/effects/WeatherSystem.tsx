import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { FaCloud, FaSun, FaMoon, FaSnowflake } from 'react-icons/fa';

// Reference weather types from:
// frontend/src/modules/venues/zones/MoodZoneManager.tsx startLine: 27 endLine: 31

interface WeatherSystemProps {
  type: 'rain' | 'snow' | 'fog' | 'stars' | 'aurora' | 'gentle-mist' | 'starfall';
  intensity: number;
  onWeatherChange?: (type: string) => void;
}

export function WeatherSystem({ type, intensity, onWeatherChange }: WeatherSystemProps) {
  const { scene } = useThree();
  const particleSystemRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    // Initialize particle system with shaders from FestivalModeManager
    // Reference: frontend/src/modules/venues/effects/FestivalModeManager.tsx startLine: 68 endLine: 102
    
    return () => {
      if (particleSystemRef.current) {
        scene.remove(particleSystemRef.current);
      }
    };
  }, [scene]);

  useFrame((state, delta) => {
    if (particleSystemRef.current) {
      // Update particle positions based on weather type
      const particles = particleSystemRef.current.geometry as THREE.BufferGeometry;
      const positions = particles.attributes.position.array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        switch (type) {
          case 'rain':
            positions[i + 1] -= delta * intensity * 10;
            if (positions[i + 1] < -20) positions[i + 1] = 20;
            break;
          case 'snow':
            positions[i] += Math.sin(state.clock.elapsedTime + i) * delta * intensity;
            positions[i + 1] -= delta * intensity * 2;
            if (positions[i + 1] < -20) positions[i + 1] = 20;
            break;
          // Add more weather patterns
        }
      }
      particles.attributes.position.needsUpdate = true;
    }
  });

  return (
    <motion.div className="fixed top-6 right-6 bg-black/30 backdrop-blur-md rounded-xl p-4">
      <div className="flex gap-3 text-white">
        <button 
          onClick={() => onWeatherChange?.('rain')}
          className={`p-2 rounded-lg ${type === 'rain' ? 'bg-white/20' : 'hover:bg-white/10'}`}
        >
          <FaCloud />
        </button>
        <button 
          onClick={() => onWeatherChange?.('snow')}
          className={`p-2 rounded-lg ${type === 'snow' ? 'bg-white/20' : 'hover:bg-white/10'}`}
        >
          <FaSnowflake />
        </button>
      </div>
    </motion.div>
  );
}
