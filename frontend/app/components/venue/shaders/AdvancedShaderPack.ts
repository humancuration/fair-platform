import * as THREE from 'three';

export const advancedShaders = {
  liquidMetal: {
    name: "Liquid Metal",
    vertexShader: `
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec2 vUv;
      uniform float time;
      
      void main() {
        vPosition = position;
        vNormal = normal;
        vUv = uv;
        
        // Create rippling liquid effect
        vec3 pos = position;
        float wave = sin(pos.x * 2.0 + time) * cos(pos.z * 2.0 + time) * 0.1;
        pos.y += wave;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 metalColor;
      uniform float roughness;
      uniform float time;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec2 vUv;
      
      void main() {
        // Create metallic reflection effect
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - dot(normal, viewDir), 5.0);
        
        // Add flowing liquid patterns
        float flow = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 - time) * 0.5 + 0.5;
        
        // Combine metallic and liquid effects
        vec3 color = mix(metalColor, metalColor * 2.0, fresnel);
        color = mix(color, color * 0.5, flow);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    uniforms: {
      metalColor: { value: new THREE.Color("#4a4a4a") },
      roughness: { value: 0.2 },
      time: { value: 0 }
    }
  },

  quantumField: {
    name: "Quantum Visualization",
    vertexShader: `
      varying vec3 vPosition;
      uniform float time;
      attribute float probability;
      
      void main() {
        vPosition = position;
        
        // Quantum probability wave
        vec3 pos = position;
        float wave = sin(length(pos) * 5.0 - time * 2.0) * probability;
        pos += normal * wave * 0.2;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 waveColor;
      uniform vec3 particleColor;
      uniform float time;
      varying vec3 vPosition;
      
      float quantumNoise(vec3 p) {
        return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
      }
      
      void main() {
        // Create quantum probability clouds
        float noise = quantumNoise(vPosition + time * 0.1);
        float wave = sin(length(vPosition) * 8.0 - time * 3.0) * 0.5 + 0.5;
        
        // Particle-wave duality effect
        vec3 color = mix(waveColor, particleColor, wave);
        float alpha = smoothstep(0.4, 0.6, noise);
        
        gl_FragColor = vec4(color, alpha);
      }
    `,
    uniforms: {
      waveColor: { value: new THREE.Color("#00ffff") },
      particleColor: { value: new THREE.Color("#ff00ff") },
      time: { value: 0 }
    },
    settings: {
      transparent: true,
      blending: THREE.AdditiveBlending
    }
  },

  geometricAbstract: {
    name: "Abstract Geometric",
    vertexShader: `
      varying vec3 vPosition;
      varying vec2 vUv;
      uniform float time;
      
      void main() {
        vPosition = position;
        vUv = uv;
        
        // Create geometric distortions
        vec3 pos = position;
        float dist = length(pos.xy);
        pos.z += sin(dist * 5.0 + time) * 0.2;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 color3;
      uniform float time;
      varying vec3 vPosition;
      varying vec2 vUv;
      
      void main() {
        // Create geometric patterns
        vec2 grid = fract(vUv * 5.0);
        float pattern = step(0.5, grid.x) + step(0.5, grid.y);
        
        // Rotating color patterns
        float angle = atan(vPosition.y, vPosition.x) + time;
        float radius = length(vPosition.xy);
        
        vec3 color = mix(
          mix(color1, color2, sin(angle * 3.0) * 0.5 + 0.5),
          color3,
          sin(radius * 5.0 - time) * 0.5 + 0.5
        );
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    uniforms: {
      color1: { value: new THREE.Color("#ff3366") },
      color2: { value: new THREE.Color("#33ff99") },
      color3: { value: new THREE.Color("#3366ff") },
      time: { value: 0 }
    }
  }
};
