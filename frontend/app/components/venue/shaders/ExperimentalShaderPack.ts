import * as THREE from 'three';

export const experimentalShaders = {
  glitchCRT: {
    name: "Retro CRT",
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 tint;
      varying vec2 vUv;
      
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }
      
      void main() {
        vec2 uv = vUv;
        
        // Scanlines
        float scanline = sin(uv.y * 100.0) * 0.1;
        
        // RGB Split
        float shift = sin(time) * 0.003;
        float r = texture2D(tDiffuse, uv + vec2(shift, 0.0)).r;
        float g = texture2D(tDiffuse, uv).g;
        float b = texture2D(tDiffuse, uv - vec2(shift, 0.0)).b;
        
        // Random glitches
        float glitch = step(0.98, random(vec2(time * 0.1, uv.y * 0.1)));
        uv.x += glitch * 0.1;
        
        vec3 color = vec3(r, g, b) * tint + scanline;
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    uniforms: {
      time: { value: 0 },
      tint: { value: new THREE.Color("#ff00ff") }
    }
  },

  watercolor: {
    name: "Painterly",
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vUv = uv;
        vNormal = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float brushSize;
      uniform float time;
      varying vec2 vUv;
      varying vec3 vNormal;
      
      void main() {
        vec2 uv = vUv;
        float noise = snoise(vec3(uv * brushSize, time * 0.1));
        
        // Create watercolor edge effects
        vec2 offset = vec2(noise) * 0.02;
        vec3 color = texture2D(tDiffuse, uv + offset).rgb;
        
        // Add paper texture and color bleeding
        float paper = snoise(vec3(uv * 50.0, 0.0));
        color += vec3(paper * 0.1);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    uniforms: {
      tDiffuse: { value: null },
      brushSize: { value: 5.0 },
      time: { value: 0 }
    }
  },

  fractals: {
    name: "Fractal Dreams",
    vertexShader: `
      varying vec3 vPosition;
      void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color1;
      uniform vec3 color2;
      varying vec3 vPosition;
      
      float mandelbrot(vec2 c) {
        vec2 z = vec2(0.0);
        for(int i = 0; i < 100; i++) {
          z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
          if(length(z) > 2.0) return float(i) / 100.0;
        }
        return 0.0;
      }
      
      void main() {
        vec2 uv = vPosition.xy * 0.5;
        uv *= sin(time * 0.1) + 2.0;
        float m = mandelbrot(uv);
        vec3 color = mix(color1, color2, m);
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    uniforms: {
      time: { value: 0 },
      color1: { value: new THREE.Color("#ff00ff") },
      color2: { value: new THREE.Color("#00ffff") }
    }
  }
};
