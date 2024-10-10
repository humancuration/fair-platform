// frontend/src/store/slices/themeSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  darkMode: boolean;
}

const initialState: ThemeState = {
  darkMode: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleDarkMode(state, action: PayloadAction<boolean>) {
      state.darkMode = action.payload;
      if (action.payload) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
  },
});

export const { toggleDarkMode } = themeSlice.actions;
export default themeSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  currentTheme: string;
  customStyles: Record<string, string>;
}

const initialState: ThemeState = {
  currentTheme: 'default',
  customStyles: {},
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<string>) => {
      state.currentTheme = action.payload;
    },
    setCustomStyle: (state, action: PayloadAction<{ key: string; value: string }>) => {
      state.customStyles[action.payload.key] = action.payload.value;
    },
  },
});

export const { setTheme, setCustomStyle } = themeSlice.actions;
export default themeSlice.reducer;