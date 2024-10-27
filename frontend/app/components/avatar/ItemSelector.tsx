import type { Inventory } from "~/types";

interface ItemSelectorProps {
  inventory: Inventory;
  onItemSelect: (itemId: string, itemType: string) => void;
}

export function ItemSelector({ inventory, onItemSelect }: ItemSelectorProps) {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold">Items</h3>
      <div className="grid grid-cols-3 gap-4">
        {inventory.map((item) => (
          <div
            key={item.id}
            className="cursor-pointer border p-2 rounded hover:border-blue-500 transition-colors"
            onClick={() => onItemSelect(item.id, item.type)}
          >
            <img src={item.image} alt={item.name} className="w-full h-auto" />
            <p className="text-center mt-2">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
