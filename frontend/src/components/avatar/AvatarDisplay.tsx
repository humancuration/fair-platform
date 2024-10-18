import React, { useState } from 'react';
import './AvatarDisplay.css'; // We'll create this file next

interface AvatarDisplayProps {
  avatar: {
    baseImage: string;
    accessories: string[];
    colors: Record<string, string>;
    outfit?: string;
    mood: string;
  };
}

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ avatar }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <div className="relative w-64 h-64 avatar-container" onClick={triggerAnimation}>
      <img 
        src={avatar.baseImage} 
        alt="Avatar Base" 
        className={`absolute inset-0 avatar-image ${isAnimating ? 'animate-bounce' : ''}`} 
      />
      {avatar.outfit && (
        <img 
          src={`/images/outfits/${avatar.outfit}.png`} 
          alt="Avatar Outfit" 
          className={`absolute inset-0 avatar-image ${isAnimating ? 'animate-bounce' : ''}`} 
        />
      )}
      {avatar.accessories.map((accessory, index) => (
        <img 
          key={index} 
          src={accessory} 
          alt={`Accessory ${index + 1}`} 
          className={`absolute inset-0 avatar-image ${isAnimating ? 'animate-bounce' : ''}`} 
        />
      ))}
      <div className="absolute bottom-0 left-0 bg-white p-1 rounded">
        Mood: {avatar.mood}
      </div>
      <div className="absolute top-0 right-0 bg-white p-1 rounded">
        <img src={`/images/moods/${avatar.mood}.png`} alt={`Mood: ${avatar.mood}`} className="w-6 h-6" />
      </div>
    </div>
  );
};

export default AvatarDisplay;
