export const getEffectMovement = (effect: string): string => {
  switch (effect) {
    case 'sparkles':
      return `
        pos.y += sin(time + position.x) * 0.2;
        pos.x += cos(time + position.z) * 0.2;
      `;
    case 'fireflies':
      return `
        float angle = time * 0.5 + position.x * 2.0;
        pos.x += sin(angle) * 0.3;
        pos.y += cos(angle) * 0.2;
        pos.z += sin(time + position.y) * 0.1;
      `;
    case 'northernLights':
      return `
        pos.x += sin(time * 0.2 + position.y) * 0.5;
        pos.y += cos(time * 0.1 + position.x) * 0.3;
        pos.z += sin(time * 0.15 + position.z) * 0.4;
      `;
    // Add more effects...
    default:
      return '';
  }
};

export const updateParticlePositions = (
  positions: Float32Array,
  effect: string,
  delta: number,
  speed: number,
  intensity: number
) => {
  for (let i = 0; i < positions.length; i += 3) {
    switch (effect) {
      case 'fireworks':
        positions[i] += Math.sin(positions[i] * 0.1) * delta * speed;
        positions[i + 1] -= delta * speed * 2;
        positions[i + 2] += Math.cos(positions[i + 2] * 0.1) * delta * speed;
        break;
      case 'butterflies':
        positions[i] += Math.sin(positions[i + 1] * 0.1) * delta * speed;
        positions[i + 1] += Math.cos(positions[i] * 0.1) * delta * speed * 0.5;
        positions[i + 2] += Math.sin(positions[i + 2] * 0.05) * delta * speed;
        break;
      // Add more effect updates...
    }
  }
};
