import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  currentTheme: 'light' | 'dark';
  customStyles: Record<string, string>;
}

const initialState: ThemeState = {
  currentTheme: 'light',
  customStyles: {},
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.currentTheme = action.payload;
    },
    setCustomStyle: (state, action: PayloadAction<{ key: string; value: string }>) => {
      state.customStyles[action.payload.key] = action.payload.value;
    },
    resetCustomStyles: (state) => {
      state.customStyles = {};
    },
  },
});

export const { setTheme, setCustomStyle, resetCustomStyles } = themeSlice.actions;
export default themeSlice.reducer;