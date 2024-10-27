export interface Avatar {
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

export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'base' | 'accessory' | 'outfit';
  image: string;
}

export type Inventory = InventoryItem[];

export interface Friend {
  id: string;
  username: string;
  avatarImage: string;
  lastGiftSent?: string;
}

export interface Event {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  unlockedItems: Array<{
    id: string;
    name: string;
    type: string;
  }>;
}

export interface Background {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
}

export interface AvatarLoaderData {
  user: {
    id: string;
    username: string;
  };
  avatar: Avatar;
  inventory: Inventory;
  events: Event[];
  quests: Quest[];
  friends: Friend[];
}
