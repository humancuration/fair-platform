import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';

interface WardrobeItem {
  id: string;
  name: string;
  type: 'outfit' | 'accessory';
  image: string;
}

interface WardrobeProps {
  userId: string;
  onItemSelect: (item: WardrobeItem) => void;
}

const Wardrobe: FC<WardrobeProps> = ({ userId, onItemSelect }) => {
  const { data: items, isError } = useQuery<WardrobeItem[]>({
    queryKey: ['wardrobe', userId],
    queryFn: async () => {
      const response = await fetch(`/api/wardrobe/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch wardrobe items');
      return response.json();
    }
  });

  if (isError) {
    return <div>Error loading wardrobe items</div>;
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold">Wardrobe</h3>
      <div className="grid grid-cols-3 gap-2">
        {items?.map((item) => (
          <div 
            key={item.id} 
            className="border p-2 rounded cursor-pointer hover:bg-gray-50" 
            onClick={() => onItemSelect(item)}
          >
            <img src={item.image} alt={item.name} className="w-full h-auto" />
            <p className="text-center mt-1">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wardrobe;
