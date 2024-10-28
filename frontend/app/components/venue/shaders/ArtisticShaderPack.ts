import * as THREE from 'three';

export const artisticShaders = {
  comicBook: {
    name: "Comic Book",
    vertexShader: `
      varying vec3 vNormal;
      varying vec2 vUv;
      varying vec3 vViewPosition;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform sampler2D halftonePattern;
      uniform float outlineThickness;
      varying vec3 vNormal;
      varying vec2 vUv;
      
      void main() {
        // Edge detection for comic outlines
        float edge = length(fwidth(vNormal));
        float outline = smoothstep(0.0, outlineThickness, edge);
        
        // Halftone effect
        vec2 halftoneUv = vUv * 50.0;
        float pattern = texture2D(halftonePattern, halftoneUv).r;
        
        // Posterize colors
        vec3 posterized = floor(color * 4.0) / 4.0;
        
        gl_FragColor = vec4(
          mix(posterized, vec3(0.0), outline),
          1.0
        );
      }
    `,
    uniforms: {
      color: { value: new THREE.Color() },
      halftonePattern: { value: null },
      outlineThickness: { value: 0.8 }
    }
  },

  lowPoly: {
    name: "Low Poly",
    vertexShader: `
      varying vec3 vPosition;
      varying vec3 vNormal;
      
      void main() {
        vPosition = position;
        vNormal = normal;
        
        // Faceted normals for low-poly look
        vec3 facetedNormal = normalize(cross(dFdx(position), dFdy(position)));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 baseColor;
      uniform float polygonSize;
      varying vec3 vPosition;
      varying vec3 vNormal;
      
      void main() {
        // Create faceted shading
        vec3 light = normalize(vec3(1.0, 1.0, 1.0));
        float diff = dot(vNormal, light);
        
        // Add slight color variation per polygon
        vec3 color = baseColor + noise3D(floor(vPosition * polygonSize)) * 0.1;
        
        gl_FragColor = vec4(color * diff, 1.0);
      }
    `,
    uniforms: {
      baseColor: { value: new THREE.Color("#ffffff") },
      polygonSize: { value: 5.0 }
    }
  },

  dreamSequence: {
    name: "Dream Sequence",
    vertexShader: `
      varying vec2 vUv;
      varying float vDistortion;
      uniform float time;
      
      void main() {
        vUv = uv;
        vec3 pos = position;
        
        // Add wavy distortion
        float distortion = sin(pos.x * 2.0 + time) * sin(pos.y * 2.0 + time) * 0.1;
        pos.z += distortion;
        vDistortion = distortion;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      uniform float blurAmount;
      uniform sampler2D tDiffuse;
      varying vec2 vUv;
      varying float vDistortion;
      
      void main() {
        // Dreamy color mixing
        vec2 distortedUv = vUv + vec2(
          sin(vUv.y * 10.0 + vDistortion) * 0.02,
          cos(vUv.x * 10.0 + vDistortion) * 0.02
        );
        
        vec4 texel = texture2D(tDiffuse, distortedUv);
        vec3 color = mix(color1, color2, vDistortion + 0.5);
        
        gl_FragColor = vec4(mix(texel.rgb, color, 0.5), 1.0);
      }
    `,
    uniforms: {
      color1: { value: new THREE.Color("#ff69b4") },
      color2: { value: new THREE.Color("#4169e1") },
      blurAmount: { value: 1.0 },
      time: { value: 0 },
      tDiffuse: { value: null }
    }
  }
};
