import React, { useEffect } from 'react';

interface PetCheckinProps {
  unlockedShapes: string[];
  accessories: string[];
}

const PetCheckin: React.FC<PetCheckinProps> = ({ unlockedShapes, accessories }) => {
  useEffect(() => {
    const lastCheckIn = localStorage.getItem('lastCheckIn');
    const now = Date.now();

    if (!lastCheckIn || now - parseInt(lastCheckIn, 10) > 1209600000) { // 14 days in ms
      // Unlock new features
      // e.g., add new shape to unlockedShapes or new accessory
      unlockedShapes.push('triangle');
      accessories.push('hat');
      localStorage.setItem('lastCheckIn', now.toString());
    }
  }, [unlockedShapes, accessories]);

  return null; // This component doesn't render anything
};

export default PetCheckin;
