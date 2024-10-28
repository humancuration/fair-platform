import * as THREE from 'three';

interface ShaderStyle {
  name: string;
  vertexShader: string;
  fragmentShader: string;
  uniforms: Record<string, THREE.IUniform>;
  settings?: {
    transparent?: boolean;
    blending?: THREE.BlendingDstFactor;
    depthWrite?: boolean;
  };
}

export const venueShaders: Record<string, ShaderStyle> = {
  toonShade: {
    name: "Cel Shaded",
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform float bands;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
        float diff = dot(normal, lightDir);
        float cel = ceil(diff * bands) / bands;
        gl_FragColor = vec4(color * cel, 1.0);
      }
    `,
    uniforms: {
      color: { value: new THREE.Color(0xffffff) },
      bands: { value: 4.0 }
    }
  },

  vaporwave: {
    name: "Vaporwave",
    vertexShader: `
      varying vec2 vUv;
      varying float vElevation;
      uniform float time;
      
      void main() {
        vUv = uv;
        vec3 pos = position;
        pos.y += sin(pos.x * 2.0 + time) * 0.1;
        vElevation = pos.y;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 colorA;
      uniform vec3 colorB;
      uniform float time;
      varying vec2 vUv;
      varying float vElevation;
      
      void main() {
        float stripe = mod(vUv.y * 10.0 + time, 1.0);
        vec3 color = mix(colorA, colorB, vUv.y + sin(time * 0.5) * 0.2);
        color += vec3(stripe * 0.1);
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    uniforms: {
      colorA: { value: new THREE.Color("#ff71ce") },
      colorB: { value: new THREE.Color("#01cdfe") },
      time: { value: 0 }
    }
  },

  holographic: {
    name: "Holographic",
    vertexShader: `
      varying vec3 vPosition;
      varying vec2 vUv;
      uniform float time;
      
      void main() {
        vPosition = position;
        vUv = uv;
        vec3 pos = position;
        pos.y += sin(time + position.x * 2.0) * 0.02;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 baseColor;
      uniform float time;
      varying vec3 vPosition;
      varying vec2 vUv;
      
      void main() {
        float holo = sin(vPosition.y * 20.0 + time * 2.0) * 0.5 + 0.5;
        vec3 color = baseColor + vec3(0.2, 0.5, 1.0) * holo;
        float alpha = 0.6 + sin(vUv.y * 40.0 + time) * 0.1;
        gl_FragColor = vec4(color, alpha);
      }
    `,
    uniforms: {
      baseColor: { value: new THREE.Color("#00ffff") },
      time: { value: 0 }
    },
    settings: {
      transparent: true,
      blending: THREE.AdditiveBlending
    }
  }
};
