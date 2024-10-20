import { combineSlices, configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
// import other slices as needed

const rootReducer = combineSlices(
  { theme: themeReducer },
  // other slices
);

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
