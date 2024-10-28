import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAcousticSimulation } from '../hooks/useAcousticSimulation';

interface CrowdEnergy {
  joy: number;
  intensity: number;
  synchronization: number;
  resonance: number;
}

export function CollectiveEnergyField({ crowdEnergy }: { crowdEnergy: CrowdEnergy }) {
  const { scene } = useThree();
  const particlesRef = useRef<THREE.Points>();
  const acousticSim = useAcousticSimulation();

  useEffect(() => {
    const geometry = new THREE.BufferGeometry();
    const particleCount = 10000;
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 20 + Math.random() * 10;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      phases[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float phase;
        varying vec3 vColor;
        uniform float time;
        uniform float joy;
        uniform float intensity;
        uniform float synchronization;
        
        void main() {
          vec3 pos = position;
          float energyPulse = sin(time * 2.0 + phase) * intensity;
          
          // Create collective movement patterns
          pos += normal * energyPulse * 2.0;
          pos *= 1.0 + sin(time * synchronization + length(pos)) * 0.1;
          
          vColor = color;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = (joy * 5.0 + 2.0) * (1000.0 / length(pos.xyz));
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          gl_FragColor = vec4(vColor, 1.0 - dist * 2.0);
        }
      `,
      uniforms: {
        time: { value: 0 },
        joy: { value: 0 },
        intensity: { value: 0 },
        synchronization: { value: 0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    particlesRef.current = points;

    return () => scene.remove(points);
  }, [scene]);

  useFrame((state, delta) => {
    if (particlesRef.current) {
      const material = particlesRef.current.material as THREE.ShaderMaterial;
      material.uniforms.time.value += delta;
      material.uniforms.joy.value = crowdEnergy.joy;
      material.uniforms.intensity.value = crowdEnergy.intensity;
      material.uniforms.synchronization.value = crowdEnergy.synchronization;

      // Update colors based on crowd energy
      const colors = particlesRef.current.geometry.attributes.color.array as Float32Array;
      for (let i = 0; i < colors.length; i += 3) {
        colors[i] = 0.5 + crowdEnergy.joy * 0.5;
        colors[i + 1] = 0.2 + crowdEnergy.intensity * 0.8;
        colors[i + 2] = crowdEnergy.resonance;
      }
      particlesRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  return null;
}
