import * as THREE from 'three';

export const realityShaders = {
  dimensionalRift: {
    name: "Dimensional Rift",
    vertexShader: `
      varying vec3 vPosition;
      varying vec2 vUv;
      uniform float time;
      uniform float realityBend;
      uniform float crowdEnergy;
      uniform vec3 bendOrigin;
      
      float fractalNoise(vec3 p) {
        float sum = 0.0;
        float amp = 1.0;
        float freq = 1.0;
        for(int i = 0; i < 6; i++) {
          sum += sin(p.x*freq) * sin(p.y*freq) * sin(p.z*freq) * amp;
          freq *= 2.0;
          amp *= 0.5;
        }
        return sum;
      }
      
      void main() {
        vPosition = position;
        vUv = uv;
        
        // Create reality-bending effect
        vec3 pos = position;
        vec3 dirToBend = pos - bendOrigin;
        float dist = length(dirToBend);
        
        // Space-time warping
        float warpFactor = sin(dist * 3.0 - time * 2.0) * realityBend;
        pos += normalize(dirToBend) * warpFactor;
        
        // Dimensional fractures
        float fracture = fractalNoise(pos * 0.1 + time * 0.1) * crowdEnergy;
        pos += normal * fracture;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 riftColor;
      uniform float time;
      uniform float realityBend;
      varying vec3 vPosition;
      varying vec2 vUv;
      
      void main() {
        // Create interdimensional patterns
        float pattern = sin(vPosition.x * 10.0 + time) * 
                       cos(vPosition.y * 10.0 - time) * 
                       sin(vPosition.z * 10.0 + time * 0.5);
                       
        // Reality tear effect
        float tear = smoothstep(0.3, 0.7, pattern) * realityBend;
        
        vec3 color = mix(riftColor, vec3(1.0), tear);
        float alpha = 0.8 * realityBend;
        
        gl_FragColor = vec4(color, alpha);
      }
    `,
    uniforms: {
      riftColor: { value: new THREE.Color("#ff00ff") },
      realityBend: { value: 0.0 },
      crowdEnergy: { value: 0.0 },
      time: { value: 0 },
      bendOrigin: { value: new THREE.Vector3() }
    },
    settings: {
      transparent: true,
      blending: THREE.AdditiveBlending
    }
  }
};
