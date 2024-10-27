export interface BaseWishlistItem {
  id: string;
  name: string;
  description: string;
  image?: string;
  isPublic: boolean;
}

export interface PersonalWishlistItem extends BaseWishlistItem {
  price?: number;
}

export interface CommunityWishlistItem extends BaseWishlistItem {
  user: string;
  targetAmount: number;
  currentAmount: number;
  date: string;
  contributors?: Array<{
    userId: string;
    amount: number;
    date: string;
  }>;
  category?: string;
  milestones?: Array<{
    title: string;
    description: string;
    targetAmount: number;
    isCompleted: boolean;
  }>;
}

export interface Wishlist {
  id: number;
  name: string;
  description?: string;
  isPublic: boolean;
  items: PersonalWishlistItem[];
}

export interface CommunityWishlist {
  id: number;
  name: string;
  description?: string;
  items: CommunityWishlistItem[];
  totalContributions: number;
  contributorsCount: number;
}
