import * as THREE from 'three';

export const quantumEntanglementShaders = {
  entanglementField: {
    vertexShader: `
      attribute float entanglementStrength;
      attribute float quantumState;
      varying vec3 vPosition;
      varying float vEntanglement;
      uniform float time;
      
      float quantumFluctuation(vec3 pos, float state) {
        return sin(length(pos) * 5.0 + time + state * 6.28) * 
               cos(pos.y * 3.0 + time * 0.5) * 
               sin(pos.z * 2.0 + state * 6.28);
      }
      
      void main() {
        vPosition = position;
        vEntanglement = entanglementStrength;
        
        // Create quantum probability waves
        vec3 pos = position;
        float fluctuation = quantumFluctuation(pos, quantumState);
        pos += normal * fluctuation * entanglementStrength;
        
        // Add quantum tunneling effect
        float tunnel = sin(time * 2.0 + length(pos)) * 0.5 + 0.5;
        pos *= 1.0 + tunnel * 0.1 * entanglementStrength;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = entanglementStrength * 5.0 * (1000.0 / length(pos.xyz));
      }
    `,
    fragmentShader: `
      varying vec3 vPosition;
      varying float vEntanglement;
      uniform vec3 colorA;
      uniform vec3 colorB;
      uniform float time;
      
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        
        // Create quantum interference patterns
        float interference = sin(vPosition.x * 10.0 + time) * 
                           cos(vPosition.y * 8.0 - time * 0.5) * 
                           sin(vPosition.z * 6.0 + time * 0.2);
        
        vec3 color = mix(colorA, colorB, interference * vEntanglement);
        float alpha = (1.0 - dist * 2.0) * vEntanglement;
        
        gl_FragColor = vec4(color, alpha);
      }
    `,
    uniforms: {
      time: { value: 0 },
      colorA: { value: new THREE.Color("#ff00ff") },
      colorB: { value: new THREE.Color("#00ffff") },
      entanglementStrength: { value: 0 }
    }
  }
};
