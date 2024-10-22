import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  currentTheme: 'light' | 'dark' | string;
  darkMode: boolean;
  customStyles: Record<string, string>;
}

const initialState: ThemeState = {
  currentTheme: 'light',
  darkMode: false,
  customStyles: {},
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | string>) => {
      state.currentTheme = action.payload;
    },
    toggleDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
      state.currentTheme = action.payload ? 'dark' : 'light';
      if (action.payload) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setCustomStyle: (state, action: PayloadAction<{ key: string; value: string }>) => {
      state.customStyles[action.payload.key] = action.payload.value;
    },
    resetCustomStyles: (state) => {
      state.customStyles = {};
    },
  },
});

export const { setTheme, toggleDarkMode, setCustomStyle, resetCustomStyles } = themeSlice.actions;
export default themeSlice.reducer;