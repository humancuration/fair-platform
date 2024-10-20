import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/api';
import AvatarDisplay from './AvatarDisplay';
import AvatarStats from './AvatarStats';
import ItemSelector from './ItemSelector';
import MoodSelector from './MoodSelector';
import EmotionSelector from './EmotionSelector';
import BackgroundSelector from './BackgroundSelector';
import { useToast } from '../../hooks/useToast';

interface Avatar {
  id: string;
  baseImage: string;
  accessories: string[];
  colors: Record<string, string>;
  outfit?: string;
  mood: string;
  xp: number;
  level: number;
  emotion: string;
  emotionIntensity: number;
  background?: string;
}

interface AvatarCustomizerProps {
  userId: string;
}

const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({ userId }) => {
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const toast = useToast();

  const fetchAvatarAndInventory = useCallback(async () => {
    try {
      const [avatarResponse, inventoryResponse] = await Promise.all([
        api.get(`/avatar/${userId}`),
        api.get(`/inventory/${userId}`)
      ]);
      setAvatar(avatarResponse.data);
      setInventory(inventoryResponse.data);
    } catch (error) {
      console.error('Error fetching avatar and inventory:', error);
      toast.error('Failed to load avatar data. Please try again.');
    }
  }, [userId, toast]);

  useEffect(() => {
    fetchAvatarAndInventory();
  }, [fetchAvatarAndInventory]);

  const handleItemSelect = async (itemId: string, itemType: string) => {
    if (!avatar) return;
    try {
      const updatedAvatar = { ...avatar };
      switch (itemType) {
        case 'base':
          updatedAvatar.baseImage = itemId;
          break;
        case 'accessory':
          updatedAvatar.accessories = [...updatedAvatar.accessories, itemId];
          break;
        case 'color':
          updatedAvatar.colors[itemId] = inventory.find(item => item.id === itemId)?.color || updatedAvatar.colors[itemId];
          break;
        case 'outfit':
          updatedAvatar.outfit = itemId;
          break;
      }
      const response = await api.put(`/avatar/${userId}`, updatedAvatar);
      setAvatar(response.data);
      toast.success('Avatar updated successfully!');
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error('Failed to update avatar. Please try again.');
    }
  };

  const handleMoodChange = async (newMood: string) => {
    if (!avatar) return;
    try {
      const response = await api.put(`/avatar/${userId}/mood`, { mood: newMood });
      setAvatar(response.data);
      toast.success('Mood updated successfully!');
    } catch (error) {
      console.error('Error updating avatar mood:', error);
      toast.error('Failed to update mood. Please try again.');
    }
  };

  const handleEmotionChange = async (emotion: string, intensity: number) => {
    if (!avatar) return;
    try {
      const response = await api.put(`/avatar/${userId}/emotion`, { emotion, intensity });
      setAvatar(response.data);
      toast.success('Emotion updated successfully!');
    } catch (error) {
      console.error('Error updating avatar emotion:', error);
      toast.error('Failed to update emotion. Please try again.');
    }
  };

  const handleBackgroundChange = async (backgroundId: string) => {
    if (!avatar) return;
    try {
      const response = await api.put(`/avatar/${userId}/background`, { backgroundId });
      setAvatar(response.data);
      toast.success('Background updated successfully!');
    } catch (error) {
      console.error('Error updating avatar background:', error);
      toast.error('Failed to update background. Please try again.');
    }
  };

  if (!avatar) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-4">
        <AvatarDisplay avatar={avatar} />
        <AvatarStats xp={avatar.xp} level={avatar.level} />
      </div>
      <div className="w-full md:w-1/2 p-4">
        <ItemSelector inventory={inventory} onItemSelect={handleItemSelect} />
        <MoodSelector currentMood={avatar.mood} onMoodChange={handleMoodChange} />
        <EmotionSelector
          userId={userId}
          currentEmotion={avatar.emotion}
          currentIntensity={avatar.emotionIntensity}
          onEmotionChange={handleEmotionChange}
        />
        <BackgroundSelector
          userId={userId}
          currentBackground={avatar.background ?? ''}
          onBackgroundChange={handleBackgroundChange}
        />
      </div>
    </div>
  );
};

export default AvatarCustomizer;
