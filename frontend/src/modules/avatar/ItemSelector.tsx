import React from 'react';

interface Item {
  id: string;
  name: string;
  type: 'base' | 'accessory' | 'outfit'; // Added 'outfit' type
  image: string;
  // ... any other fields ...
}

interface ItemSelectorProps {
  inventory: Item[]; // Updated to use typed Item
  onItemSelect: (itemId: string, itemType: string) => void;
}

const ItemSelector: React.FC<ItemSelectorProps> = ({ inventory, onItemSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {inventory.map((item) => (
        <div
          key={item.id}
          className="cursor-pointer border p-2 rounded"
          onClick={() => onItemSelect(item.id, item.type)}
        >
          <img src={item.image} alt={item.name} className="w-full h-auto" />
          <p className="text-center mt-2">{item.name}</p>
        </div>
      ))}
    </div>
  );
};

export default ItemSelector;
