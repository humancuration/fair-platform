import React from 'react';

interface AvatarDisplayProps {
  avatar: {
    baseImage: string;
    accessories: string[];
    colors: Record<string, string>;
  };
}

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ avatar }) => {
  return (
    <div className="relative w-64 h-64">
      <img src={avatar.baseImage} alt="Avatar Base" className="absolute inset-0" />
      {avatar.accessories.map((accessory, index) => (
        <img key={index} src={accessory} alt={`Accessory ${index + 1}`} className="absolute inset-0" />
      ))}
      {/* Apply colors here if needed */}
    </div>
  );
};

export default AvatarDisplay;
