import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { Link } from 'react-router-dom';

interface Background {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
}

interface BackgroundSelectorProps {
  userId: string;
  currentBackground: string;
  onBackgroundChange: (backgroundId: string) => void;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ 
  userId, 
  currentBackground, 
  onBackgroundChange 
}) => {
  const [backgrounds, setBackgrounds] = useState<Background[]>([]);
  const [ownedBackgrounds, setOwnedBackgrounds] = useState<string[]>([]);

  useEffect(() => {
    const fetchBackgrounds = async () => {
      try {
        const response = await api.get('/marketplace/backgrounds');
        setBackgrounds(response.data);
      } catch (error) {
        console.error('Error fetching backgrounds:', error);
      }
    };

    const fetchOwnedBackgrounds = async () => {
      try {
        const response = await api.get(`/users/${userId}/owned-backgrounds`);
        setOwnedBackgrounds(response.data);
      } catch (error) {
        console.error('Error fetching owned backgrounds:', error);
      }
    };

    fetchBackgrounds();
    fetchOwnedBackgrounds();
  }, [userId]);

  const handleBackgroundChange = async (backgroundId: string) => {
    try {
      await api.put(`/avatar/${userId}/background`, { backgroundId });
      onBackgroundChange(backgroundId);
    } catch (error) {
      console.error('Error updating background:', error);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold">Avatar Background</h3>
      <div className="grid grid-cols-3 gap-2 mt-2">
        {backgrounds.map((background) => (
          <div 
            key={background.id} 
            className={`cursor-pointer border p-2 rounded ${currentBackground === background.id ? 'border-blue-500' : ''}`}
          >
            <img src={background.imageUrl} alt={background.name} className="w-full h-auto" />
            <p className="text-center mt-1">{background.name}</p>
            {ownedBackgrounds.includes(background.id) ? (
              <button
                onClick={() => handleBackgroundChange(background.id)}
                className="w-full mt-2 px-2 py-1 bg-green-500 text-white rounded"
              >
                Select
              </button>
            ) : (
              <Link
                to={`/marketplace/product/${background.id}`}
                className="block w-full mt-2 px-2 py-1 bg-blue-500 text-white rounded text-center"
              >
                Buy (${background.price})
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundSelector;
