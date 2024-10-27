import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FaMoon, FaSun, FaFire, FaWater, FaLeaf, FaStar } from 'react-icons/fa';
import { useAcousticSimulation } from '../hooks/useAcousticSimulation';
import { createParticles } from '../animations/ParticleEffects';

interface MoodZone {
  id: string;
  type: 'chill' | 'energetic' | 'mystical' | 'nature' | 'urban' | 'cosmic';
  position: [number, number, number];
  radius: number;
  intensity: number;
  color: string | string[];
  particles: {
    count: number;
    speed: number;
    size: number;
    type: 'sparkles' | 'fireflies' | 'stardust' | 'leaves' | 'bubbles';
  };
  soundscape: {
    ambient: string[];
    effects: string[];
    reverb: number;
  };
  currentActivity?: {
    type: 'listening_party' | 'live_performance' | 'dj_set' | 'meditation';
    participants: number;
  };
}

interface CrowdMood {
  energy: number;
  density: number;
  movement: number;
  dominantGenre: 'electronic' | 'hiphop' | 'pop' | 'rock' | 'classical';
  emotionalState: 'energized' | 'relaxed' | 'excited' | 'sad';
}

export function MoodZoneManager() {
  const [zones, setZones] = useState<MoodZone[]>([]);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [crowdMood, setCrowdMood] = useState<CrowdMood>({
    energy: 0.5,
    density: 0.5,
    movement: 0.5,
    dominantGenre: 'electronic',
    emotionalState: 'energized'
  });

  const { scene } = useThree();
  const acousticSim = useAcousticSimulation();

  useEffect(() => {
    initializeZones();
    return () => cleanupZones();
  }, []);

  const handleZoneInteraction = useCallback((zoneId: string) => {
    setActiveZone(zoneId);
    const zone = zones.find(z => z.id === zoneId);
    if (zone) {
      // Create particle burst effect
      const particles = createParticles({
        position: zone.position,
        count: 50,
        colors: Array.isArray(zone.color) ? zone.color : [zone.color],
        lifetime: 2000
      });
      
      // Update audio and weather
      updateZoneAudio(zone);
      updateZoneWeather(zone);
    }
  }, [zones]);

  useFrame((state, delta) => {
    // Update particle systems
    zones.forEach(zone => {
      const system = scene.getObjectByName(`particles-${zone.id}`);
      if (system) {
        updateParticleSystem(system as THREE.Points, zone, delta);
      }
    });

    // Update crowd mood based on music analysis and zone interactions
    updateCrowdMood(delta);
  });

  return (
    <div className="relative w-full h-full">
      <AnimatePresence>
        {zones.map(zone => (
          <motion.div
            key={zone.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: zone.intensity,
              scale: activeZone === zone.id ? 1.05 : 1,
              background: `radial-gradient(circle, ${
                Array.isArray(zone.color) ? zone.color.join(', ') : zone.color
              })`
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => handleZoneInteraction(zone.id)}
            className="absolute rounded-2xl overflow-hidden cursor-pointer backdrop-blur-sm"
            style={{
              left: `${zone.position[0]}%`,
              top: `${zone.position[1]}%`,
              width: `${zone.radius * 2}%`,
              height: `${zone.radius * 2}%`,
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <motion.div
                className="text-white text-opacity-80 text-4xl mb-2"
                animate={{ 
                  rotate: activeZone === zone.id ? [0, 360] : 0,
                  scale: activeZone === zone.id ? [1, 1.2, 1] : 1
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {zone.type === 'chill' && <FaMoon />}
                {zone.type === 'energetic' && <FaSun />}
                {zone.type === 'mystical' && <FaStar />}
                {zone.type === 'nature' && <FaLeaf />}
                {zone.type === 'urban' && <FaFire />}
                {zone.type === 'cosmic' && <FaWater />}
              </motion.div>

              {zone.currentActivity && (
                <motion.div 
                  className="absolute bottom-4 left-4 right-4 bg-black/30 rounded-lg p-3 backdrop-blur-md"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <div className="text-white text-sm">
                    {zone.currentActivity.type === 'listening_party' && '🎧'}
                    {zone.currentActivity.type === 'live_performance' && '🎸'}
                    {zone.currentActivity.type === 'dj_set' && '🎵'}
                    {zone.currentActivity.type === 'meditation' && '🧘'}
                    <span className="ml-2">
                      {zone.currentActivity.participants} vibing
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
