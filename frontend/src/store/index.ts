import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
// Import other reducers as needed

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    // Add other reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
