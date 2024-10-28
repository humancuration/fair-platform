import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTheme } from '@mui/material';
import * as THREE from 'three';
// import { motion } from 'framer-motion-3d';

interface Visualizer3DProps {
  getAnalyserData: () => Uint8Array;
}

export const Visualizer3D: React.FC<Visualizer3DProps> = ({ getAnalyserData }) => {
  const theme = useTheme();
  const barsRef = useRef<THREE.Mesh[]>([]);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const numBars = 64;
    const radius = 3;
    const geometry = new THREE.BoxGeometry(0.1, 1, 0.1);
    const material = new THREE.MeshPhysicalMaterial({
      color: theme.palette.primary.main,
      metalness: 0.5,
      roughness: 0.1,
      reflectivity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.1
    });

    // Create circular arrangement of bars
    for (let i = 0; i < numBars; i++) {
      const angle = (i / numBars) * Math.PI * 2;
      const bar = new THREE.Mesh(geometry, material.clone());
      
      bar.position.x = Math.cos(angle) * radius;
      bar.position.z = Math.sin(angle) * radius;
      bar.rotation.y = angle;
      
      if (groupRef.current) {
        groupRef.current.add(bar);
        barsRef.current.push(bar);
      }
    }

    return () => {
      barsRef.current.forEach(bar => {
        bar.geometry.dispose();
        (bar.material as THREE.Material).dispose();
      });
    };
  }, [theme]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const data = getAnalyserData();
    const lowerHalf = data.slice(0, data.length / 2);

    barsRef.current.forEach((bar, i) => {
      const value = lowerHalf[i] / 255;
      
      // Smooth animation using lerp
      bar.scale.y = THREE.MathUtils.lerp(
        bar.scale.y,
        value * 3 + 0.1,
        0.1
      );

      // Dynamic color based on frequency
      const hue = (i / barsRef.current.length) * 0.3 + 0.5;
      const color = new THREE.Color().setHSL(hue, 0.8, 0.5 + value * 0.5);
      (bar.material as THREE.MeshPhysicalMaterial).color = color;
      
      // Add some movement
      bar.rotation.z = value * 0.2;
    });

    // Rotate the entire group
    groupRef.current.rotation.y += 0.002;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight
        position={[0, 10, 0]}
        angle={0.5}
        penumbra={1}
        intensity={1}
        castShadow
      />
    </group>
  );
};
