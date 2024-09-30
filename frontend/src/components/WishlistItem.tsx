import React from 'react';
import Button from './Button';

interface WishlistItemProps {
  item: {
    id: string;
    name: string;
    description: string;
    image: string;
    isPublic: boolean;
  };
  onTogglePublic: () => void;
}

const WishlistItem: React.FC<WishlistItemProps> = ({ item, onTogglePublic }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-md mb-4" />
      <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{item.description}</p>
      <Button onClick={onTogglePublic} variant={item.isPublic ? "secondary" : "primary"}>
        {item.isPublic ? 'Make Private' : 'Make Public'}
      </Button>
    </div>
  );
};

export default WishlistItem;