import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { portalShaders } from '../shaders/PortalShaderPack';
import { useVisualSettings } from '../settings/VisualSettingsManager';

interface Portal {
  id: string;
  sourceZone: string;
  targetZone: string;
  position: [number, number, number];
  rotation: [number, number, number];
  size: number;
  color: string;
}

export function PortalSystem({ portals }: { portals: Portal[] }) {
  const { scene } = useThree();
  const portalRefs = useRef<Map<string, THREE.Mesh>>(new Map());
  const settings = useVisualSettings();

  useEffect(() => {
    // Create noise texture for portal effect
    const noiseTexture = new THREE.TextureLoader().load('/textures/noise.png');
    noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;

    portals.forEach(portal => {
      const geometry = new THREE.CircleGeometry(portal.size, 64);
      const material = new THREE.ShaderMaterial({
        ...portalShaders.dimensionalGate,
        uniforms: {
          ...portalShaders.dimensionalGate.uniforms,
          portalColor: { value: new THREE.Color(portal.color) },
          noiseTexture: { value: noiseTexture }
        },
        side: THREE.DoubleSide,
        transparent: true
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...portal.position);
      mesh.rotation.set(...portal.rotation);
      
      scene.add(mesh);
      portalRefs.current.set(portal.id, mesh);
    });

    return () => {
      portalRefs.current.forEach(mesh => scene.remove(mesh));
    };
  }, [scene, portals]);

  useFrame((state, delta) => {
    portalRefs.current.forEach(mesh => {
      const material = mesh.material as THREE.ShaderMaterial;
      material.uniforms.time.value += delta;
      
      // Pulse the portal based on nearby activity
      const pulseIntensity = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.9;
      material.uniforms.portalOpen.value = pulseIntensity;
    });
  });

  return null;
}
