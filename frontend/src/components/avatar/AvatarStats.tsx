import React from 'react';

interface AvatarStatsProps {
  xp: number;
  level: number;
}

const AvatarStats: React.FC<AvatarStatsProps> = ({ xp, level }) => {
  const xpToNextLevel = level * 100; // Simple formula for XP needed to level up

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold">Avatar Stats</h3>
      <p>Level: {level}</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{width: `${(xp / xpToNextLevel) * 100}%`}}
        ></div>
      </div>
      <p className="text-sm">XP: {xp} / {xpToNextLevel}</p>
    </div>
  );
};

export default AvatarStats;
