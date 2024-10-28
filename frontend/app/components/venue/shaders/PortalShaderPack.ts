import * as THREE from 'three';

export const portalShaders = {
  dimensionalGate: {
    name: "Dimensional Gate",
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float time;
      uniform float portalOpen;
      
      void main() {
        vUv = uv;
        vPosition = position;
        
        // Create portal swirl effect
        float angle = length(position.xy) * 10.0 * portalOpen;
        mat2 rotation = mat2(
          cos(angle), -sin(angle),
          sin(angle), cos(angle)
        );
        
        vec3 pos = position;
        pos.xy = rotation * pos.xy;
        pos += normal * sin(time * 2.0 + length(pos) * 5.0) * 0.1 * portalOpen;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 portalColor;
      uniform float time;
      uniform float portalOpen;
      uniform sampler2D noiseTexture;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        // Create swirling portal effect
        vec2 centeredUv = vUv - 0.5;
        float dist = length(centeredUv);
        
        float noise = texture2D(noiseTexture, 
          vUv + vec2(sin(time), cos(time)) * 0.1
        ).r;
        
        float edge = smoothstep(0.5 * portalOpen, 0.4 * portalOpen, dist);
        float ripple = sin(dist * 40.0 - time * 5.0) * 0.5 + 0.5;
        
        vec3 color = portalColor * (1.0 + ripple * 0.5) * (1.0 + noise * 0.2);
        float alpha = edge * portalOpen;
        
        gl_FragColor = vec4(color, alpha);
      }
    `,
    uniforms: {
      portalColor: { value: new THREE.Color("#4b0082") },
      portalOpen: { value: 0.0 },
      time: { value: 0 },
      noiseTexture: { value: null }
    }
  }
};
