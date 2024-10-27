import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion-3d';
import { ParticleSystem } from '../effects/ParticleSystem';

interface StageEffectsProps {
  stage: {
    id: string;
    type: 'main' | 'underground' | 'ambient' | 'experimental';
    currentTrack: {
      bpm: number;
      energy: number;
      genre: string;
    };
    lightingRig: {
      spotlights: number;
      lasers: number;
      strobes: number;
    };
  };
  intensity: number;
}

export function StageEffects({ stage, intensity }: StageEffectsProps) {
  const { scene } = useThree();
  const lightingRef = useRef<THREE.Group>(new THREE.Group());
  const timeRef = useRef(0);

  useEffect(() => {
    // Initialize stage lighting
    const lights = createStageLighting(stage.lightingRig);
    lightingRef.current.add(...lights);
    scene.add(lightingRef.current);

    return () => {
      scene.remove(lightingRef.current);
    };
  }, [scene, stage.lightingRig]);

  useFrame((state, delta) => {
    timeRef.current += delta;

    // Update lighting based on music
    updateLighting(stage.currentTrack, delta);
    
    // Sync visual effects with BPM
    const beatInterval = 60 / stage.currentTrack.bpm;
    const beatPhase = (timeRef.current % beatInterval) / beatInterval;
    
    updateVisualEffects(beatPhase, stage.currentTrack.energy);
  });

  return (
    <>
      {/* Dynamic stage particles based on genre/energy */}
      <ParticleSystem
        type="stage"
        effect={getGenreEffect(stage.currentTrack.genre)}
        position={[0, 5, 0]}
        intensity={intensity * stage.currentTrack.energy}
        color={getGenreColors(stage.currentTrack.genre)}
        count={1000}
        speed={stage.currentTrack.bpm / 60}
      />

      {/* Stage-specific ambient effects */}
      {stage.type === 'underground' && (
        <ParticleSystem
          type="ambient"
          effect="smoke"
          position={[0, 0, 0]}
          intensity={0.3}
          color="#334455"
          count={500}
          speed={0.1}
        />
      )}

      {/* Laser effects for high-energy moments */}
      {stage.currentTrack.energy > 0.8 && (
        <motion.group
          animate={{
            rotateY: 360,
            transition: { duration: 10, repeat: Infinity }
          }}
        >
          {Array.from({ length: stage.lightingRig.lasers }).map((_, i) => (
            <LaserBeam
              key={i}
              color={getGenreColors(stage.currentTrack.genre)[0]}
              angle={(360 / stage.lightingRig.lasers) * i}
              intensity={intensity}
            />
          ))}
        </motion.group>
      )}
    </>
  );
}
