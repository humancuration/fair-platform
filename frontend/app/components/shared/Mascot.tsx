import React from 'react';

interface MascotProps {
  color?: string;
  accessory?: 'glasses' | 'hat' | 'bowtie' | 'none';
  expression?: 'happy' | 'surprised' | 'wink';
}

const Mascot: React.FC<MascotProps> = ({ color = '#FF6F61', accessory = 'none', expression = 'happy' }) => {
  const accessories = {
    glasses: (
      <g>
        <rect x="60" y="80" width="80" height="20" fill="#000" />
        <rect x="60" y="80" width="30" height="20" fill="#3498db" />
        <rect x="110" y="80" width="30" height="20" fill="#3498db" />
      </g>
    ),
    hat: (
      <path d="M50 60 Q100 0 150 60 L150 80 Q100 60 50 80 Z" fill="#3498db" />
    ),
    bowtie: (
      <path d="M85 140 L75 150 L85 160 L100 155 L115 160 L125 150 L115 140 Z" fill="#e74c3c" />
    ),
    none: null
  };

  const expressions = {
    happy: (
      <g>
        <path d="M70 100 Q100 130 130 100" fill="none" stroke="#000" strokeWidth="5" />
        <circle cx="80" cy="80" r="10" fill="#000" />
        <circle cx="120" cy="80" r="10" fill="#000" />
      </g>
    ),
    surprised: (
      <g>
        <circle cx="100" cy="120" r="15" fill="#000" />
        <circle cx="80" cy="80" r="15" fill="#000" />
        <circle cx="120" cy="80" r="15" fill="#000" />
      </g>
    ),
    wink: (
      <g>
        <path d="M70 110 Q100 140 130 110" fill="none" stroke="#000" strokeWidth="5" />
        <circle cx="80" cy="80" r="10" fill="#000" />
        <path d="M110 80 Q120 70 130 80" fill="none" stroke="#000" strokeWidth="5" />
      </g>
    )
  };

  return (
    <svg viewBox="0 0 200 200">
      {/* Mascot body */}
      <circle cx="100" cy="100" r="80" fill={color} />
      
      {/* Expression */}
      {expressions[expression]}
      
      {/* Accessory */}
      {accessories[accessory]}
    </svg>
  );
};

export default Mascot;
