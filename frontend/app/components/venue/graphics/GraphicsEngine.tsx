import { extend, useThree, useFrame } from '@react-three/fiber';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

extend({ EffectComposer, UnrealBloomPass });

interface GraphicsEngineProps {
  quality: 'low' | 'medium' | 'high' | 'ultra';
  style: 'realistic' | 'stylized' | 'neon' | 'psychedelic';
}

export function GraphicsEngine({ quality, style }: GraphicsEngineProps) {
  const { gl, scene, camera } = useThree();
  const composerRef = useRef<EffectComposer>();

  useEffect(() => {
    const composer = new EffectComposer(gl);
    
    // Add post-processing effects based on style
    switch (style) {
      case 'neon':
        const bloomPass = new UnrealBloomPass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          1.5, 0.4, 0.85
        );
        composer.addPass(bloomPass);
        break;
      case 'psychedelic':
        // Add color shifting and wave distortion
        break;
    }

    composerRef.current = composer;
  }, [gl, style]);

  useFrame(() => {
    composerRef.current?.render();
  }, 1);

  return null;
}
