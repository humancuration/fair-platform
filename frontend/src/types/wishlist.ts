export interface WishlistItem {
  id: string;
  name: string;
  description: string;
  image: string;
  isPublic: boolean;
}

export interface CommunityWishlistItem {
  id: string;
  user: string;
  name: string;
  description: string;
  image: string;
  targetAmount: number;
  currentAmount: number;
  date: string;
}
