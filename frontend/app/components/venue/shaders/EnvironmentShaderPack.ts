import * as THREE from 'three';

export const environmentShaders = {
  dynamicTerrain: {
    name: "Dynamic Terrain",
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float crowdEnergy;
      uniform float time;
      uniform float bpm;
      
      void main() {
        vUv = uv;
        vPosition = position;
        
        // Create dynamic terrain deformation
        float energyWave = sin(position.x * 2.0 + time) * 
                          cos(position.z * 2.0 + time) * 
                          crowdEnergy;
        
        // Add music-reactive waves
        float musicWave = sin(position.x * 4.0 - (time * (bpm / 60.0))) * 
                         sin(position.z * 4.0) * 0.3;
        
        vec3 pos = position;
        pos.y += energyWave * 2.0 + musicWave * crowdEnergy;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 baseColor;
      uniform float crowdEnergy;
      uniform float time;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        // Create dynamic color patterns
        float pattern = sin(vUv.x * 20.0 + time) * 
                       cos(vUv.y * 20.0 + time) * 0.5 + 0.5;
        
        vec3 color = mix(baseColor, baseColor * 1.5, pattern * crowdEnergy);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    uniforms: {
      baseColor: { value: new THREE.Color("#4a9eff") },
      crowdEnergy: { value: 0.0 },
      time: { value: 0 },
      bpm: { value: 120.0 }
    }
  },

  volumetricClouds: {
    name: "Volumetric Clouds",
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vWorldPosition;
      
      void main() {
        vUv = uv;
        vPosition = position;
        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 cloudColor;
      uniform float density;
      uniform vec3 lightPosition;
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vWorldPosition;
      
      float fbm(vec3 p) {
        float f = 0.0;
        float amp = 0.5;
        for(int i = 0; i < 4; i++) {
          f += amp * snoise(p);
          p *= 2.0;
          amp *= 0.5;
        }
        return f;
      }
      
      void main() {
        vec3 lightDir = normalize(lightPosition - vWorldPosition);
        
        // Create volumetric noise
        float noise = fbm(vPosition * 0.1 + time * 0.1);
        float cloud = smoothstep(0.4, 0.6, noise) * density;
        
        // Add light scattering
        float scatter = pow(max(0.0, dot(lightDir, normalize(vPosition))), 16.0);
        
        vec3 color = mix(cloudColor * 0.5, cloudColor, scatter);
        gl_FragColor = vec4(color, cloud);
      }
    `,
    uniforms: {
      time: { value: 0 },
      cloudColor: { value: new THREE.Color("#ffffff") },
      density: { value: 0.5 },
      lightPosition: { value: new THREE.Vector3(50, 100, 50) }
    },
    settings: {
      transparent: true,
      blending: THREE.AdditiveBlending
    }
  }
};
