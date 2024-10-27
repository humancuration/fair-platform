import { useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useAcousticSimulation } from '../hooks/useAcousticSimulation';

interface SoundscapeProps {
  stage?: {
    id: string;
    currentTrack: {
      bpm: number;
      energy: number;
      genre: string;
    };
  };
  zone?: {
    type: 'chill' | 'energetic' | 'mystical' | 'nature' | 'urban' | 'cosmic';
    soundscape: {
      ambient: string[];
      effects: string[];
      reverb: number;
    };
  };
  position: [number, number, number];
  radius: number;
}

export function SoundscapeManager({ stage, zone, position, radius }: SoundscapeProps) {
  const { scene } = useThree();
  const acousticSim = useAcousticSimulation();
  const audioSourcesRef = useRef<THREE.PositionalAudio[]>([]);
  const [currentAmbience, setCurrentAmbience] = useState<string[]>([]);

  // Reference acoustic properties from MoodZoneManager
  // frontend/src/modules/venues/zones/MoodZoneManager.tsx
  // startLine: 200
  // endLine: 216

  useEffect(() => {
    const listener = new THREE.AudioListener();
    scene.add(listener);

    // Initialize audio sources
    const audioLoader = new THREE.AudioLoader();
    
    if (zone) {
      // Load ambient sounds for the zone
      zone.soundscape.ambient.forEach((soundUrl, index) => {
        const sound = new THREE.PositionalAudio(listener);
        audioLoader.load(soundUrl, (buffer) => {
          sound.setBuffer(buffer);
          sound.setRefDistance(radius);
          sound.setLoop(true);
          sound.setVolume(0.5);
          sound.play();
        });
        audioSourcesRef.current.push(sound);
      });
    }

    return () => {
      audioSourcesRef.current.forEach(source => {
        source.stop();
        source.disconnect();
      });
    };
  }, [scene, zone, radius]);

  useEffect(() => {
    if (!acousticSim || !zone) return;

    const acousticProperties = {
      reverberation: zone.soundscape.reverb,
      absorption: calculateAbsorption(),
      diffusion: calculateDiffusion(),
      spatialEffects: {
        width: radius * 2,
        depth: radius * 2,
        height: 50
      }
    };

    acousticSim.updateZoneAcoustics(zone.type, acousticProperties);
  }, [zone, acousticSim, radius]);

  const calculateAbsorption = () => {
    if (!zone) return 0.3;
    
    const baseAbsorption = {
      chill: 0.6,
      energetic: 0.2,
      mystical: 0.4,
      nature: 0.3,
      urban: 0.5,
      cosmic: 0.1
    }[zone.type];

    return baseAbsorption;
  };

  const calculateDiffusion = () => {
    if (!zone) return 0.3;
    
    const baseDiffusion = {
      chill: 0.4,
      energetic: 0.6,
      mystical: 0.8,
      nature: 0.5,
      urban: 0.3,
      cosmic: 0.7
    }[zone.type];

    return baseDiffusion;
  };

  // Reference stage audio setup from VirtualVenue.tsx
  // startLine: 52
  // endLine: 104

  return (
    <group position={position}>
      {audioSourcesRef.current.map((source, index) => (
        <primitive key={index} object={source} />
      ))}
      {stage && (
        <mesh visible={false} position={[0, 0, 0]}>
          <sphereGeometry args={[radius, 32, 32]} />
          <meshBasicMaterial wireframe />
        </mesh>
      )}
    </group>
  );
}
