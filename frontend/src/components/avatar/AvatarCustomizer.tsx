import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import AvatarDisplay from './AvatarDisplay';
import AvatarStats from './AvatarStats';
import ItemSelector from './ItemSelector';
import MoodSelector from './MoodSelector'; // New component

interface Avatar {
  baseImage: string;
  accessories: string[];
  colors: Record<string, string>;
  outfit?: string;
  mood: string;
  xp: number;
  level: number;
}

interface AvatarCustomizerProps {
  userId: string;
}

const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({ userId }) => {
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [inventory, setInventory] = useState<any[]>([]);

  useEffect(() => {
    const fetchAvatarAndInventory = async () => {
      try {
        const avatarResponse = await api.get(`/avatar/${userId}`);
        setAvatar(avatarResponse.data);

        const inventoryResponse = await api.get(`/inventory/${userId}`);
        setInventory(inventoryResponse.data);
      } catch (error) {
        console.error('Error fetching avatar and inventory:', error);
      }
    };

    fetchAvatarAndInventory();
  }, [userId]);

  const handleItemSelect = async (itemId: string, itemType: string) => {
    try {
      if (!avatar) return;
      let updatedAvatar = { ...avatar };

      if (itemType === 'base') {
        updatedAvatar.baseImage = itemId;
      } else if (itemType === 'accessory') {
        updatedAvatar.accessories = [...updatedAvatar.accessories, itemId];
      } else if (itemType === 'color') {
        updatedAvatar.colors[itemId] = inventory.find(item => item.id === itemId)?.color || updatedAvatar.colors[itemId];
      } else if (itemType === 'outfit') {
        updatedAvatar.outfit = itemId;
      }

      const response = await api.put(`/avatar/${userId}`, updatedAvatar);
      setAvatar(response.data);
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  const handleMoodChange = async (newMood: string) => {
    try {
      if (!avatar) return;
      const updatedAvatar = { ...avatar, mood: newMood };
      const response = await api.put(`/avatar/${userId}`, updatedAvatar);
      setAvatar(response.data);
    } catch (error) {
      console.error('Error updating avatar mood:', error);
    }
  };

  if (!avatar) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex">
        <div className="w-1/2">
          <AvatarDisplay avatar={avatar} />
          <AvatarStats xp={avatar.xp} level={avatar.level} />
        </div>
        <div className="w-1/2">
          <ItemSelector inventory={inventory} onItemSelect={handleItemSelect} />
        </div>
      </div>
      <MoodSelector currentMood={avatar.mood} onMoodChange={handleMoodChange} />
    </div>
  );
};

export default AvatarCustomizer;
