import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleProps {
  type: 'ambient' | 'stage' | 'festival';
  effect: 'sparkles' | 'fireflies' | 'stardust' | 'leaves' | 'bubbles' | 'fireworks' | 'butterflies' | 'northernLights';
  position: [number, number, number];
  intensity: number;
  color: string | string[];
  count: number;
  speed?: number;
  size?: number;
  lifetime?: number;
}

export function ParticleSystem({ type, effect, position, intensity, color, count, speed = 1, size = 1, lifetime }: ParticleProps) {
  const { scene } = useThree();
  const particleSystemRef = useRef<THREE.Points>();

  useEffect(() => {
    // Reference shader setup from FestivalModeManager
    // Reference: frontend/src/modules/venues/effects/FestivalModeManager.tsx
    // startLine: 68
    // endLine: 102

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      sizes[i] = Math.random() * size;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(Array.isArray(color) ? color[0] : color) },
      },
      vertexShader: `
        uniform float time;
        attribute float size;
        void main() {
          vec3 pos = position;
          
          // Different movement patterns based on effect type
          ${getEffectMovement(effect)}
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / length(pos.xyz)) * ${intensity.toFixed(1)};
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        void main() {
          float r = distance(gl_PointCoord, vec2(0.5));
          if (r > 0.5) discard;
          gl_FragColor = vec4(color, 1.0 - (r * 2.0));
        }
      `,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    });

    const particles = new THREE.Points(geometry, material);
    particles.position.set(...position);
    scene.add(particles);
    particleSystemRef.current = particles;

    return () => {
      scene.remove(particles);
    };
  }, [scene, effect, count, position, color, intensity]);

  useFrame((state, delta) => {
    if (!particleSystemRef.current) return;

    // Reference particle update logic from MoodZoneManager
    // Reference: frontend/src/modules/venues/zones/MoodZoneManager.tsx
    // startLine: 174
    // endLine: 198

    const material = particleSystemRef.current.material as THREE.ShaderMaterial;
    material.uniforms.time.value += delta * speed;

    // Update positions based on effect type
    const positions = particleSystemRef.current.geometry.attributes.position.array as Float32Array;
    updateParticlePositions(positions, effect, delta, speed, intensity);
    particleSystemRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return null;
}
