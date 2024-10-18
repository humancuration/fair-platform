import React, { useState, useEffect } from 'react';
import api from '../../api/api';

interface WardrobeItem {
  id: string;
  name: string;
  type: 'outfit' | 'accessory';
  image: string;
}

const Wardrobe: React.FC<{ userId: string; onItemSelect: (item: WardrobeItem) => void }> = ({ userId, onItemSelect }) => {
  const [items, setItems] = useState<WardrobeItem[]>([]);

  useEffect(() => {
    fetchWardrobeItems();
  }, []);

  const fetchWardrobeItems = async () => {
    try {
      const response = await api.get(`/wardrobe/${userId}`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching wardrobe items:', error);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold">Wardrobe</h3>
      <div className="grid grid-cols-3 gap-2">
        {items.map((item) => (
          <div key={item.id} className="border p-2 rounded cursor-pointer" onClick={() => onItemSelect(item)}>
            <img src={item.image} alt={item.name} className="w-full h-auto" />
            <p className="text-center mt-1">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wardrobe;
