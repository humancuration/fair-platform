import * as THREE from 'three';

export const dreamStateShaders = {
  quantumDream: {
    vertexShader: `
      attribute float dreamDepth;
      attribute float consciousness;
      varying vec3 vPosition;
      varying float vDreamDepth;
      uniform float time;
      uniform float collectiveAwareness;
      
      float dreamWave(vec3 pos, float depth) {
        return sin(pos.x * 2.0 + time) * 
               cos(pos.y * 3.0 - time * 0.5) * 
               sin(pos.z * 4.0 + depth * 6.28);
      }
      
      void main() {
        vPosition = position;
        vDreamDepth = dreamDepth;
        
        // Create dream-like distortions
        vec3 pos = position;
        float wave = dreamWave(pos, dreamDepth);
        pos += normal * wave * consciousness;
        
        // Add collective dream field effects
        float collective = sin(length(pos) * collectiveAwareness + time);
        pos *= 1.0 + collective * 0.2 * dreamDepth;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = consciousness * 4.0 * (1000.0 / length(pos.xyz));
      }
    `,
    fragmentShader: `
      varying vec3 vPosition;
      varying float vDreamDepth;
      uniform vec3 dreamColor;
      uniform vec3 realityColor;
      uniform float time;
      
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        
        // Create dream-reality interference patterns
        float pattern = sin(vPosition.x * 8.0 + time) * 
                       cos(vPosition.y * 6.0 - time * 0.3) * 
                       sin(vPosition.z * 4.0 + time * 0.2);
        
        vec3 color = mix(realityColor, dreamColor, pattern * vDreamDepth);
        float alpha = (1.0 - dist * 2.0) * smoothstep(0.0, 1.0, vDreamDepth);
        
        gl_FragColor = vec4(color, alpha);
      }
    `,
    uniforms: {
      time: { value: 0 },
      dreamColor: { value: new THREE.Color("#9400D3") },
      realityColor: { value: new THREE.Color("#4B0082") },
      collectiveAwareness: { value: 0 }
    }
  }
};
