import type { FC } from 'react';

function mulberry32(seed: number): () => number {
  return function() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface AvatarGeneratorProps {
  seed: string;
  colors?: string[] | null;
  unlockedShapes?: string[];
  accessories?: string[];
  outfit?: string;
  className?: string;
}

const AvatarGenerator: FC<AvatarGeneratorProps> = ({ 
  seed, 
  colors = null, 
  unlockedShapes = ['rectangle'], 
  accessories = [],
  outfit = null,
  className = '',
}) => {
  // Rest of the component logic remains the same
  // ... 

  return (
    <svg width={size} height={size} className={className}>
      {/* Existing SVG content */}
      {outfit && (
        <image 
          href={`/images/outfits/${outfit}.svg`} 
          x="0" 
          y="0" 
          width={size} 
          height={size} 
        />
      )}
    </svg>
  );
};

export default AvatarGenerator;
