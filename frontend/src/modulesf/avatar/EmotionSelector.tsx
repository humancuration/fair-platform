import React from 'react';
import api from '../../api/api';

interface EmotionSelectorProps {
  userId: string;
  currentEmotion: string;
  currentIntensity: number;
  onEmotionChange: (emotion: string, intensity: number) => void;
}

const emotions = ['happy', 'sad', 'angry', 'surprised', 'neutral'];

const EmotionSelector: React.FC<EmotionSelectorProps> = ({ 
  userId, 
  currentEmotion, 
  currentIntensity, 
  onEmotionChange 
}) => {
  const handleEmotionChange = async (emotion: string) => {
    try {
      await api.put(`/avatar/${userId}/emotion`, { emotion, intensity: currentIntensity });
      onEmotionChange(emotion, currentIntensity);
    } catch (error) {
      console.error('Error updating emotion:', error);
    }
  };

  const handleIntensityChange = async (intensity: number) => {
    try {
      await api.put(`/avatar/${userId}/emotion`, { emotion: currentEmotion, intensity });
      onEmotionChange(currentEmotion, intensity);
    } catch (error) {
      console.error('Error updating emotion intensity:', error);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold">Avatar Emotion</h3>
      <div className="flex space-x-2 mt-2">
        {emotions.map((emotion) => (
          <button
            key={emotion}
            className={`px-3 py-1 rounded ${
              currentEmotion === emotion ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => handleEmotionChange(emotion)}
          >
            {emotion}
          </button>
        ))}
      </div>
      <div className="mt-2">
        <label htmlFor="intensity" className="block text-sm font-medium text-gray-700">
          Intensity: {currentIntensity}
        </label>
        <input
          type="range"
          id="intensity"
          min="1"
          max="10"
          value={currentIntensity}
          onChange={(e) => handleIntensityChange(parseInt(e.target.value))}
          className="mt-1 block w-full"
        />
      </div>
    </div>
  );
};

export default EmotionSelector;
