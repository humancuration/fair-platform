// User related types
export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar?: string;
  bio?: string;
  timezone: string;
  points: number;
  notificationsEnabled: boolean;
  theme: string;
  fediverseProfile?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Product and Commerce types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  sustainabilityScore: number;
  createdAt: Date;
  updatedAt: Date;
  vendor?: Vendor;
  vendorId?: string;
  reviews?: Review[];
  tags?: Tag[];
}

export interface Vendor {
  id: string;
  name: string;
  description: string;
  logo?: string;
  website?: string;
  sustainabilityRating: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  products?: Product[];
}

export interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  shippingAddress: string;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
  user?: User;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

// Community and Social types
export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  product?: Product;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  replies?: Comment[];
}

export interface Tag {
  id: string;
  name: string;
  type: 'product' | 'content' | 'campaign';
  products?: Product[];
}

// Campaign and Rewards types
export interface Campaign {
  id: string;
  title: string;
  description: string;
  goal: number;
  currentAmount: number;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  rewards?: Reward[];
}

export interface Reward {
  id: string;
  campaignId: string;
  name: string;
  description: string;
  points: number;
  type: 'badge' | 'coupon' | 'item';
  status: 'active' | 'inactive' | 'expired';
  campaign?: Campaign;
}

// Media and Content types
export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  title: string;
  description?: string;
  mimeType: string;
  fileSize: number;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Playlist {
  id: string;
  userId: string;
  title: string;
  description?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  tracks?: Track[];
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverArt: string;
  duration: number;
  visualizerType: 'bars' | 'circles' | 'waves';
  genre: string;
  bpm: number;
  playlistId?: string;
  playlist?: Playlist;
  moodAnalysis?: MoodAnalysis;
}

// Analytics and Metrics types
export interface MoodAnalysis {
  id: string;
  trackId: string;
  energy: number;
  danceability: number;
  valence: number;
  tempo: number;
  acousticness: number;
  instrumentalness: number;
  createdAt: Date;
  track?: Track;
}

export interface ActivityLog {
  id: string;
  userId: string;
  type: 'view' | 'like' | 'share' | 'purchase' | 'comment';
  targetId: string;
  targetType: 'product' | 'campaign' | 'playlist' | 'track';
  metadata?: Record<string, any>;
  createdAt: Date;
  user?: User;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'share' | 'collaboration' | 'addition' | 'mention';
  content: string;
  read: boolean;
  createdAt: Date;
  user?: User;
}

// Supply Chain types
export interface SupplyChainNode {
  id: string;
  type: 'supplier' | 'manufacturer' | 'distributor' | 'retailer';
  name: string;
  sustainabilityScore: number;
  location: {
    lat: number;
    lng: number;
  };
  certifications: string[];
}

export interface SupplyChainLink {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'material' | 'transport';
  carbonEmission: number;
  verificationStatus: 'verified' | 'pending' | 'disputed';
  source?: SupplyChainNode;
  target?: SupplyChainNode;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    totalPages?: number;
    totalCount?: number;
  };
}

// Form types
export interface FormError {
  field?: string;
  message: string;
}

export interface ActionData {
  error?: string;
  success?: boolean;
  fields?: Record<string, string>;
}

