import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { environmentShaders } from '../shaders/EnvironmentShaderPack';
import { useVisualSettings } from '../settings/VisualSettingsManager';

interface EnvironmentProps {
  crowdEnergy: number;
  musicData: {
    bpm: number;
    energy: number;
  };
  weather: {
    type: 'clear' | 'cloudy' | 'storm';
    intensity: number;
  };
}

export function EnvironmentManager({ crowdEnergy, musicData, weather }: EnvironmentProps) {
  const { scene } = useThree();
  const terrainRef = useRef<THREE.Mesh>();
  const cloudsRef = useRef<THREE.Mesh>();
  const settings = useVisualSettings();

  useEffect(() => {
    // Create dynamic terrain
    const terrainGeo = new THREE.PlaneGeometry(200, 200, 128, 128);
    const terrainMat = new THREE.ShaderMaterial({
      ...environmentShaders.dynamicTerrain,
      side: THREE.DoubleSide
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.rotation.x = -Math.PI / 2;
    scene.add(terrain);
    terrainRef.current = terrain;

    // Create volumetric clouds if enabled
    if (settings.experimental.enableVolumetrics) {
      const cloudsGeo = new THREE.BoxGeometry(200, 30, 200, 64, 32, 64);
      const cloudsMat = new THREE.ShaderMaterial(environmentShaders.volumetricClouds);
      const clouds = new THREE.Mesh(cloudsGeo, cloudsMat);
      clouds.position.y = 50;
      scene.add(clouds);
      cloudsRef.current = clouds;
    }

    return () => {
      scene.remove(terrainRef.current!);
      if (cloudsRef.current) scene.remove(cloudsRef.current);
    };
  }, [scene, settings.experimental.enableVolumetrics]);

  useFrame((state, delta) => {
    if (terrainRef.current) {
      const material = terrainRef.current.material as THREE.ShaderMaterial;
      material.uniforms.time.value += delta;
      material.uniforms.crowdEnergy.value = crowdEnergy;
      material.uniforms.bpm.value = musicData.bpm;
    }

    if (cloudsRef.current) {
      const material = cloudsRef.current.material as THREE.ShaderMaterial;
      material.uniforms.time.value += delta * 0.2;
      material.uniforms.density.value = weather.type === 'clear' ? 0.3 : 0.8;
    }
  });

  return null;
}
