import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useQuantumState } from '../hooks/useQuantumState';

type ViewMode = 'firstPerson' | 'thirdPerson' | 'topDown' | 'quantum' | 'free';

interface QuantumCameraProps {
  viewMode: ViewMode;
  target?: THREE.Vector3;
  quantumEntanglementStrength: number;
}

export function QuantumCameraController({ 
  viewMode, 
  target, 
  quantumEntanglementStrength 
}: QuantumCameraProps) {
  const { camera, scene } = useThree();
  const cameraRef = useRef<THREE.PerspectiveCamera>(camera);
  const quantumState = useQuantumState();

  useEffect(() => {
    // Initialize camera based on view mode
    switch(viewMode) {
      case 'firstPerson':
        camera.position.set(0, 1.7, 0);
        camera.fov = 75;
        break;
      case 'thirdPerson':
        camera.position.set(0, 3, 5);
        camera.fov = 60;
        break;
      case 'topDown':
        camera.position.set(0, 50, 0);
        camera.fov = 45;
        break;
      case 'quantum':
        // Start in random quantum superposition
        const angle = Math.random() * Math.PI * 2;
        camera.position.set(
          Math.cos(angle) * 20,
          10 + Math.random() * 20,
          Math.sin(angle) * 20
        );
        camera.fov = 90;
        break;
    }
    camera.updateProjectionMatrix();
  }, [camera, viewMode]);

  useFrame((state, delta) => {
    if (viewMode === 'quantum') {
      // Create quantum camera effects
      const time = state.clock.elapsedTime;
      
      // Quantum position fluctuation
      const quantumPos = new THREE.Vector3(
        Math.sin(time * 0.5) * quantumEntanglementStrength,
        Math.cos(time * 0.3) * quantumEntanglementStrength,
        Math.sin(time * 0.4) * quantumEntanglementStrength
      );
      
      camera.position.add(quantumPos);
      
      // Reality distortion effect on FOV
      camera.fov = 90 + Math.sin(time) * 20 * quantumEntanglementStrength;
      camera.updateProjectionMatrix();
      
      // Quantum rotation
      if (quantumState.isEntangled) {
        camera.rotation.x += Math.sin(time * 0.2) * 0.01 * quantumEntanglementStrength;
        camera.rotation.y += Math.cos(time * 0.3) * 0.01 * quantumEntanglementStrength;
      }
    }

    if (target) {
      camera.lookAt(target);
    }
  });

  return null;
}
