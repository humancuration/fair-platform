import React from 'react';

// Seedable random number generator function
function mulberry32(seed) {
  return function() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const AvatarGenerator = ({ seed, colors = null, unlockedShapes = ['rectangle'], accessories = [] }) => {
  const size = 100;
  const blockSize = size / 5;
  const defaultColors = ['#ff6f61', '#ffec5c', '#9ccc65', '#00f7ff'];
  const colorPalette = colors || defaultColors;

  // Initialize the seedable RNG
  const rng = mulberry32(parseInt(seed, 10));

  const getRandomColor = () => {
    return colorPalette[Math.floor(rng() * colorPalette.length)];
  };

  const generatePattern = () => {
    const pattern = [];
    for (let y = 0; y < 5; y++) {
      const row = [];
      for (let x = 0; x < 3; x++) {
        row.push(rng() > 0.5);
      }
      pattern.push(row);
    }
    return pattern;
  };

  const pattern = generatePattern();

  // Shape functions
  const shapes = {
    rectangle: (x, y, color) => (
      <>
        <rect
          key={`rect-${x}-${y}`}
          x={x * blockSize}
          y={y * blockSize}
          width={blockSize}
          height={blockSize}
          fill={color}
        />
        <rect
          key={`rect-${4 - x}-${y}`}
          x={(4 - x) * blockSize}
          y={y * blockSize}
          width={blockSize}
          height={blockSize}
          fill={color}
        />
      </>
    ),
    circle: (x, y, color) => (
      <>
        <circle
          key={`circle-${x}-${y}`}
          cx={x * blockSize + blockSize / 2}
          cy={y * blockSize + blockSize / 2}
          r={blockSize / 2}
          fill={color}
        />
        <circle
          key={`circle-${4 - x}-${y}`}
          cx={(4 - x) * blockSize + blockSize / 2}
          cy={y * blockSize + blockSize / 2}
          r={blockSize / 2}
          fill={color}
        />
      </>
    ),
    triangle: (x, y, color) => (
      <>
        <polygon
          key={`triangle-${x}-${y}`}
          points={`
          ${x * blockSize + blockSize / 2},${y * blockSize}
          ${x * blockSize},${(y + 1) * blockSize}
          ${(x + 1) * blockSize},${(y + 1) * blockSize}
        `}
          fill={color}
        />
        <polygon
          key={`triangle-${4 - x}-${y}`}
          points={`
          ${(4 - x) * blockSize + blockSize / 2},${y * blockSize}
          ${(4 - x) * blockSize},${(y + 1) * blockSize}
          ${(5 - x) * blockSize},${(y + 1) * blockSize}
        `}
          fill={color}
        />
      </>
    ),
  };

  // Select a shape based on the unlocked shapes and seed
  const selectedShape = unlockedShapes[Math.floor(rng() * unlockedShapes.length)];

  return (
    <svg width={size} height={size}>
      {pattern.map((row, y) =>
        row.map((filled, x) => {
          const color = filled ? getRandomColor() : '#ffffff';
          return shapes[selectedShape](x, y, color);
        })
      )}
      {/* Accessories */}
      {accessories.includes('hat') && (
        <rect x={35} y={0} width={30} height={15} fill="#000" />
      )}
      {accessories.includes('glasses') && (
        <>
          <rect x={30} y={40} width={15} height={5} fill="#000" />
          <rect x={55} y={40} width={15} height={5} fill="#000" />
          <rect x={45} y={42} width={10} height={1} fill="#000" />
        </>
      )}
    </svg>
  );
};

export default AvatarGenerator;
