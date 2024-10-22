import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import userSettingsReducer from './slices/userSettingsSlice';
import notificationsReducer from './slices/notificationsSlice';
import wishlistReducer from './slices/wishlistSlice';
import publicWishlistReducer from './slices/publicWishlistSlice';
import communityWishlistReducer from './slices/communityWishlistSlice';
import testimonialsReducer from './slices/testimonialsSlice';
import groupsReducer from './slices/groupsSlice';
import playlistsReducer from './slices/playlistsSlice';
import cartReducer from './slices/cartSlice';
import marketplaceReducer from './slices/marketplaceSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  userSettings: userSettingsReducer,
  notifications: notificationsReducer,
  wishlist: wishlistReducer,
  publicWishlist: publicWishlistReducer,
  communityWishlist: communityWishlistReducer,
  testimonials: testimonialsReducer,
  groups: groupsReducer,
  playlists: playlistsReducer,
  cart: cartReducer,
  marketplace: marketplaceReducer,
  user: (state = { token: '' }, action: any) => state, // Add a basic user reducer
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Define the state types
export interface AuthState {
  // Define your auth state properties here
}

export interface ThemeState {
  // Define your theme state properties here
}

export interface UserSettingsState {
  // Define your user settings state properties here
}

export interface NotificationsState {
  // Define your notifications state properties here
}

export interface WishlistState {
  // Define your wishlist state properties here
}

// You can add more state interfaces as needed

export interface MarketplaceState {
  products: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    type?: 'background' | 'outfit' | 'accessory';
  }>;
  recommendations: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    type?: 'background' | 'outfit' | 'accessory';
  }>;
  loading: boolean;
  error: string | null;
}
