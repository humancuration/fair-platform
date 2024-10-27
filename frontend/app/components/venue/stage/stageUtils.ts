import * as THREE from 'three';

export const getGenreEffect = (genre: string): ParticleSystem['effect'] => {
  switch (genre) {
    case 'electronic': return 'stardust';
    case 'rock': return 'fireworks';
    case 'hiphop': return 'sparkles';
    case 'ambient': return 'fireflies';
    case 'experimental': return 'northernLights';
    default: return 'sparkles';
  }
};

export const getGenreColors = (genre: string): string[] => {
  switch (genre) {
    case 'electronic': return ['#00ffff', '#ff00ff', '#ffff00'];
    case 'rock': return ['#ff0000', '#ff6b00', '#ffff00'];
    case 'hiphop': return ['#ff00ff', '#00ffff', '#ffffff'];
    case 'ambient': return ['#0077ff', '#00ffff', '#80ffff'];
    case 'experimental': return ['#ff00ff', '#ff0066', '#00ffff'];
    default: return ['#ffffff'];
  }
};

export const createStageLighting = (rig: StageEffectsProps['stage']['lightingRig']) => {
  const lights: THREE.Light[] = [];
  
  // Add spotlights
  for (let i = 0; i < rig.spotlights; i++) {
    const spotlight = new THREE.SpotLight('#ffffff', 1);
    spotlight.position.set(Math.sin(i) * 5, 5, Math.cos(i) * 5);
    spotlight.angle = Math.PI / 6;
    spotlight.penumbra = 0.3;
    lights.push(spotlight);
  }

  return lights;
};
