import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '@mui/material';

interface Visualizer3DProps {
  getAnalyserData: () => Uint8Array;
}

export const Visualizer3D: React.FC<Visualizer3DProps> = ({ getAnalyserData }) => {
  const { scene } = useThree();
  const theme = useTheme();
  const barsRef = useRef<THREE.Mesh[]>([]);
  const groupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const group = new THREE.Group();
    const groupInstance = new THREE.Group();
    groupRef.current = groupInstance;
    scene.add(groupInstance);

    const geometry = new THREE.BoxGeometry(0.1, 1, 0.1);
    const material = new THREE.MeshPhongMaterial({
      color: theme.palette.primary.main,
      shininess: 100,
      specular: 0xffffff,
    });

    const numBars = 128;
    const radius = 3;

    for (let i = 0; i < numBars; i++) {
      const bar = new THREE.Mesh(geometry, material.clone());
      const angle = (i / numBars) * Math.PI * 2;
      bar.position.x = Math.cos(angle) * radius;
      bar.position.z = Math.sin(angle) * radius;
      bar.rotation.y = angle;
      groupInstance.add(bar);
      barsRef.current.push(bar);
    }

    // Enhanced lighting
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 2, 0);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 0.8);
    spotLight.position.set(0, 5, 0);
    spotLight.angle = Math.PI / 4;
    scene.add(spotLight);

    return () => {
      scene.remove(groupInstance);
      scene.remove(pointLight);
      scene.remove(ambientLight);
      scene.remove(spotLight);
    };
  }, [scene, theme]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const data = getAnalyserData();
    const lowerHalf = data.slice(0, data.length / 2);
    const step = Math.floor(lowerHalf.length / barsRef.current.length);

    barsRef.current.forEach((bar, i) => {
      const dataIndex = i * step;
      const value = lowerHalf[dataIndex] / 255;
      
      // Smooth animation using lerp
      bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, value * 3 + 0.1, 0.1);
      
      // Dynamic color based on frequency and theme
      const hue = (i / barsRef.current.length) * 0.3 + 0.3;
      const color = new THREE.Color().setHSL(hue, 0.8, 0.5 + value * 0.5);
      (bar.material as THREE.MeshPhongMaterial).color = color;
      
      // Add some movement to bars
      bar.rotation.z = value * 0.2;
    });

    groupRef.current.rotation.y += 0.002;
  });

  return null;
};
