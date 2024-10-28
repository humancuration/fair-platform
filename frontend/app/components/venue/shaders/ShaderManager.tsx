import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { venueShaders } from './VenueShaderPack';
import { useVisualSettings } from '../settings/VisualSettingsManager';

export function useShaderEffect(meshRef: THREE.Mesh, style: string) {
  const timeRef = useRef(0);
  const settings = useVisualSettings(state => state.settings);

  useEffect(() => {
    if (!meshRef || !venueShaders[style]) return;

    const shader = venueShaders[style];
    const material = new THREE.ShaderMaterial({
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
      uniforms: shader.uniforms,
      ...shader.settings
    });

    meshRef.material = material;
  }, [meshRef, style]);

  useFrame((state, delta) => {
    if (!meshRef?.material) return;
    
    timeRef.current += delta;
    const material = meshRef.material as THREE.ShaderMaterial;
    
    if (material.uniforms.time) {
      material.uniforms.time.value = timeRef.current;
    }
  });
}
