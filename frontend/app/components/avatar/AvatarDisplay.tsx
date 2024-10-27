import { type Avatar } from "~/types";

interface AvatarDisplayProps {
  avatar: Avatar;
}

export function AvatarDisplay({ avatar }: AvatarDisplayProps) {
  return (
    <div className="relative w-64 h-64 avatar-container">
      {avatar.background && (
        <img 
          src={`/images/backgrounds/${avatar.background}.png`} 
          alt="Avatar Background" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
      )}
      <img 
        src={avatar.baseImage} 
        alt="Avatar Base" 
        className="absolute inset-0 avatar-image" 
      />
      {avatar.outfit && (
        <img 
          src={`/images/outfits/${avatar.outfit}.png`} 
          alt="Avatar Outfit" 
          className="absolute inset-0 avatar-image" 
        />
      )}
      {avatar.accessories.map((accessory, index) => (
        <img 
          key={index} 
          src={accessory} 
          alt={`Accessory ${index + 1}`} 
          className="absolute inset-0 avatar-image" 
        />
      ))}
      <div className="absolute bottom-0 left-0 bg-white p-1 rounded">
        Mood: {avatar.mood}
      </div>
      <div className="absolute top-0 right-0 bg-white p-1 rounded">
        <img 
          src={`/images/moods/${avatar.mood}.png`} 
          alt={`Mood: ${avatar.mood}`} 
          className="w-6 h-6" 
        />
      </div>
      <div className="absolute bottom-0 right-0 bg-white p-1 rounded">
        Emotion: {avatar.emotion} (Intensity: {avatar.emotionIntensity})
      </div>
    </div>
  );
}
