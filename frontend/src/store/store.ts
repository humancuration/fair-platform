// frontend/src/store/store.ts

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import userSettingsReducer from './slices/userSettingsSlice';
import notificationsReducer from './slices/notificationsSlice';
import wishlistReducer from './slices/wishlistSlice';
import publicWishlistReducer from './slices/publicWishlistSlice';
import communityWishlistReducer from './slices/communityWishlistSlice';
import testimonialsReducer from './slices/testimonialsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    userSettings: userSettingsReducer,
    notifications: notificationsReducer,
    wishlist: wishlistReducer,
    publicWishlist: publicWishlistReducer,
    communityWishlist: communityWishlistReducer,
    testimonials: testimonialsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
