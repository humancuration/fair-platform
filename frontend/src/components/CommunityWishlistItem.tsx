import React, { useState } from 'react';
import Button from './Button';

interface CommunityWishlistItemProps {
  item: {
    id: string;
    user: string;
    name: string;
    description: string;
    image: string;
    targetAmount: number;
    currentAmount: number;
    date: string;
  };
  onContribute: (amount: number) => void;
}

const CommunityWishlistItem: React.FC<CommunityWishlistItemProps> = ({ item, onContribute }) => {
  const [contribution, setContribution] = useState<number>(0);

  const handleContributeClick = () => {
    if (contribution > 0) {
      onContribute(contribution);
      setContribution(0);
    }
  };

  const progress = (item.currentAmount / item.targetAmount) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-md mb-4" />
      <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{item.description}</p>
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span>Progress: ${item.currentAmount} / ${item.targetAmount}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          min="1"
          value={contribution}
          onChange={(e) => setContribution(Number(e.target.value))}
          placeholder="Amount"
          className="p-2 border rounded flex-grow"
        />
        <Button onClick={handleContributeClick}>Contribute</Button>
      </div>
    </div>
  );
};

export default CommunityWishlistItem;