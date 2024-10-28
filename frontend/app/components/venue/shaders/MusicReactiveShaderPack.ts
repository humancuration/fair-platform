import * as THREE from 'three';

export const musicReactiveShaders = {
  soundWaves: {
    name: "Sound Waves",
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float bpm;
      uniform float energy;
      uniform float time;
      
      void main() {
        vUv = uv;
        vPosition = position;
        
        // Create wave effect synced to BPM
        float beatPhase = mod(time * (bpm / 60.0), 1.0);
        float wave = sin(position.x * 5.0 - beatPhase * 6.28) * energy;
        
        vec3 pos = position;
        pos.y += wave * 0.2;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 lowColor;
      uniform vec3 highColor;
      uniform float energy;
      uniform float time;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        // Pulse effect based on energy
        float pulse = sin(time * 10.0) * 0.5 + 0.5;
        float energyPulse = mix(0.2, 1.0, energy * pulse);
        
        // Dynamic color mixing
        vec3 color = mix(lowColor, highColor, energyPulse);
        
        // Add frequency-like patterns
        float freq = sin(vUv.x * 50.0) * 0.5 + 0.5;
        color *= 1.0 + freq * energy * 0.3;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    uniforms: {
      bpm: { value: 120.0 },
      energy: { value: 0.5 },
      time: { value: 0 },
      lowColor: { value: new THREE.Color("#2200ff") },
      highColor: { value: new THREE.Color("#ff0088") }
    }
  },

  frequencyRipples: {
    name: "Frequency Ripples",
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float bpm;
      uniform float energy;
      uniform float time;
      
      void main() {
        vUv = uv;
        vPosition = position;
        
        // Create ripple effect synced with beat
        float beatPhase = mod(time * (bpm / 60.0), 1.0);
        float dist = length(position.xy);
        float ripple = sin(dist * 10.0 - beatPhase * 6.28) * energy;
        
        vec3 pos = position;
        pos.z += ripple * 0.1;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 baseColor;
      uniform float energy;
      uniform float time;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        // Create circular frequency patterns
        float dist = length(vUv - 0.5);
        float ring = 1.0 - smoothstep(0.0, 0.5, abs(dist - (energy * 0.5)));
        
        // Add temporal variation
        float flicker = sin(time * 20.0) * 0.5 + 0.5;
        
        vec3 color = baseColor * (ring + 0.5) * (1.0 + flicker * energy);
        float alpha = ring * 0.8 + 0.2;
        
        gl_FragColor = vec4(color, alpha);
      }
    `,
    uniforms: {
      bpm: { value: 120.0 },
      energy: { value: 0.5 },
      time: { value: 0 },
      baseColor: { value: new THREE.Color("#00ffff") }
    },
    settings: {
      transparent: true,
      blending: THREE.AdditiveBlending
    }
  }
};
