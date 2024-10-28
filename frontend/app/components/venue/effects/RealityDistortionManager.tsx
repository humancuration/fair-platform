import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { realityShaders } from '../shaders/RealityShaderPack';
import { useAcousticSimulation } from '../hooks/useAcousticSimulation';

interface RealityDistortionProps {
  crowdEnergy: number;
  musicIntensity: number;
  activeZones: {
    id: string;
    position: [number, number, number];
    intensity: number;
  }[];
}

export function RealityDistortionManager({ crowdEnergy, musicIntensity, activeZones }: RealityDistortionProps) {
  const { scene } = useThree();
  const distortionRef = useRef<THREE.Mesh>();
  const acousticSim = useAcousticSimulation();

  useEffect(() => {
    // Create reality distortion mesh
    const geometry = new THREE.IcosahedronGeometry(100, 4);
    const material = new THREE.ShaderMaterial({
      ...realityShaders.dimensionalRift,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    distortionRef.current = mesh;

    return () => {
      scene.remove(mesh);
    };
  }, [scene]);

  useFrame((state, delta) => {
    if (!distortionRef.current) return;

    const material = distortionRef.current.material as THREE.ShaderMaterial;
    material.uniforms.time.value += delta;

    // Calculate combined reality distortion from all active zones
    let maxDistortion = 0;
    let distortionCenter = new THREE.Vector3();

    activeZones.forEach(zone => {
      const zonePos = new THREE.Vector3(...zone.position);
      const distortionAmount = zone.intensity * crowdEnergy * musicIntensity;
      
      if (distortionAmount > maxDistortion) {
        maxDistortion = distortionAmount;
        distortionCenter.copy(zonePos);
      }
    });

    // Update shader uniforms
    material.uniforms.realityBend.value = maxDistortion;
    material.uniforms.crowdEnergy.value = crowdEnergy;
    material.uniforms.bendOrigin.value = distortionCenter;

    // Apply acoustic distortion
    if (acousticSim) {
      acousticSim.setReverbDistortion(maxDistortion);
      acousticSim.setFrequencyShift(crowdEnergy * musicIntensity);
    }

    // Scale and rotate the distortion field
    distortionRef.current.scale.setScalar(1 + maxDistortion * 0.2);
    distortionRef.current.rotation.y += delta * maxDistortion;
  });

  return null;
}
