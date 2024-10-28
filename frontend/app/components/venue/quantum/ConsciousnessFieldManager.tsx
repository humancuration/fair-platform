import { useState, useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAcousticSimulation } from '../hooks/useAcousticSimulation';

interface ConsciousnessState {
  frequency: number;
  amplitude: number;
  phase: number;
  resonance: number;
  entanglementStrength: number;
  sharedMemories: string[];
  emotionalHarmonic: number;
  synchronicityField: {
    strength: number;
    coherence: number;
    participants: string[];
  };
}

export function ConsciousnessFieldManager() {
  const { scene } = useThree();
  const consciousnessRef = useRef<THREE.Points>();
  const acousticSim = useAcousticSimulation();
  const [sharedStates, setSharedStates] = useState<Map<string, ConsciousnessState>>(new Map());

  useEffect(() => {
    const geometry = new THREE.BufferGeometry();
    const particleCount = 100000;
    
    // Create consciousness field particles
    const positions = new Float32Array(particleCount * 3);
    const frequencies = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);
    const resonances = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Create toroidal field for consciousness waves
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;
      const radius = 30 + Math.cos(theta * 3) * 5;
      
      positions[i * 3] = Math.cos(theta) * (radius + Math.cos(phi) * 2);
      positions[i * 3 + 1] = Math.sin(phi) * 2;
      positions[i * 3 + 2] = Math.sin(theta) * (radius + Math.cos(phi) * 2);
      
      frequencies[i] = Math.random() * 10; // Different consciousness frequencies
      phases[i] = Math.random() * Math.PI * 2;
      resonances[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('frequency', new THREE.BufferAttribute(frequencies, 1));
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute('resonance', new THREE.BufferAttribute(resonances, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float frequency;
        attribute float phase;
        attribute float resonance;
        varying vec3 vPosition;
        varying float vResonance;
        uniform float time;
        uniform float collectiveResonance;
        
        void main() {
          vPosition = position;
          vResonance = resonance;
          
          // Create consciousness wave patterns
          vec3 pos = position;
          float wave = sin(frequency * time + phase) * resonance;
          
          // Add collective consciousness effects
          float collective = sin(length(pos) * collectiveResonance + time);
          pos += normal * (wave + collective * 0.2);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = (resonance * 3.0 + 1.0) * (1000.0 / length(pos.xyz));
        }
      `,
      fragmentShader: `
        varying vec3 vPosition;
        varying float vResonance;
        uniform vec3 baseColor;
        uniform vec3 resonanceColor;
        uniform float time;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          // Create consciousness interference patterns
          float pattern = sin(vPosition.x * 5.0 + time) * 
                         cos(vPosition.y * 3.0 - time * 0.5) * 
                         sin(vPosition.z * 4.0 + time * 0.2);
          
          vec3 color = mix(baseColor, resonanceColor, pattern * vResonance);
          float alpha = (1.0 - dist * 2.0) * vResonance;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      uniforms: {
        time: { value: 0 },
        collectiveResonance: { value: 0 },
        baseColor: { value: new THREE.Color("#4b0082") },
        resonanceColor: { value: new THREE.Color("#ff00ff") }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    consciousnessRef.current = points;

    return () => scene.remove(points);
  }, [scene]);

  // Update consciousness field based on shared states
  useFrame((state, delta) => {
    if (consciousnessRef.current) {
      const material = consciousnessRef.current.material as THREE.ShaderMaterial;
      material.uniforms.time.value += delta;
      
      // Calculate collective resonance from all participants
      const collectiveResonance = Array.from(sharedStates.values())
        .reduce((sum, state) => sum + state.resonance * state.entanglementStrength, 0) 
        / sharedStates.size;
      
      material.uniforms.collectiveResonance.value = collectiveResonance;
      
      // Update acoustic properties based on consciousness field
      if (acousticSim) {
        acousticSim.setResonanceField(collectiveResonance);
        acousticSim.setHarmonicConvergence(calculateHarmonicConvergence(sharedStates));
      }
    }
  });

  return null;
}
