import React from 'react';
import AvatarCustomizer from './AvatarCustomizer';
import SeasonalEvents from './SeasonalEvents';
import Achievements from './Achievements';
import DailyQuests from './DailyQuests';
import Wardrobe from './Wardrobe';
import SocialInteractions from './SocialInteractions';
import MiniGame from './MiniGame';
import { useUser } from '../../contexts/UserContext';

interface User {
  id: string;
  // Add other user properties as needed
}

const AvatarCustomizationPage: React.FC = () => {
  const { user } = useUser() as { user: User | null };

  if (!user) {
    return <div>Please log in to customize your avatar.</div>;
  }

  const handleWardrobeItemSelect = (item: any) => {
    // Implement logic to equip the selected item
    console.log('Selected wardrobe item:', item);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customize Your Avatar</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <AvatarCustomizer userId={user.id} />
          <Wardrobe userId={user.id} onItemSelect={handleWardrobeItemSelect} />
        </div>
        <div>
          <SeasonalEvents userId={user.id} />
          <DailyQuests userId={user.id} />
          <Achievements userId={user.id} />
          <SocialInteractions userId={user.id} />
          <MiniGame userId={user.id} />
        </div>
      </div>
    </div>
  );
};

export default AvatarCustomizationPage;
