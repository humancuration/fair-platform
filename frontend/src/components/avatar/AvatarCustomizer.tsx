import React, { useState, useEffect } from 'react';
import api from '../../api/api'; // Updated import path
import AvatarDisplay from './AvatarDisplay';
import ItemSelector from './ItemSelector';

interface AvatarCustomizerProps {
  userId: string;
}

const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({ userId }) => {
  const [avatar, setAvatar] = useState<any>(null);
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
      let updatedAvatar = { ...avatar };

      if (itemType === 'base') {
        updatedAvatar.baseImage = itemId;
      } else if (itemType === 'accessory') {
        updatedAvatar.accessories = [...updatedAvatar.accessories, itemId];
      } else if (itemType === 'color') {
        updatedAvatar.colors[itemId] = inventory.find(item => item.id === itemId).color;
      }

      const response = await api.put(`/avatar/${userId}`, updatedAvatar);
      setAvatar(response.data);
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  if (!avatar) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      <div className="w-1/2">
        <AvatarDisplay avatar={avatar} />
      </div>
      <div className="w-1/2">
        <ItemSelector inventory={inventory} onItemSelect={handleItemSelect} />
      </div>
    </div>
  );
};

export default AvatarCustomizer;
