// frontend/src/store/store.ts

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import userSettingsReducer from './slices/userSettingsSlice';
import notificationsReducer from './slices/notificationsSlice';
// Import other reducers as needed

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    userSettings: userSettingsReducer,
    notifications: notificationsReducer,
    // Add other reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
