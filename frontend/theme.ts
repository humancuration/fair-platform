import { createTheme, ThemeOptions } from '@mui/material/styles';

const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
};

export const themes = {
  light: createTheme({
    ...baseTheme,
    palette: {
      mode: 'light',
      primary: { main: '#4f46e5' },
      secondary: { main: '#818cf8' },
      background: { default: '#ffffff' },
      text: { primary: '#1f2937' },
    },
  }),
  dark: createTheme({
    ...baseTheme,
    palette: {
      mode: 'dark',
      primary: { main: '#3b82f6' },
      secondary: { main: '#60a5fa' },
      background: { default: '#1f2937' },
      text: { primary: '#f3f4f6' },
    },
  }),
  retro: createTheme({
    ...baseTheme,
    palette: {
      primary: { main: '#ff6f61' },
      secondary: { main: '#ffec5c' },
      background: { default: '#f3eac2' },
      text: { primary: '#2f1b0c' },
    },
  }),
  neon: createTheme({
    ...baseTheme,
    palette: {
      primary: { main: '#ff007f' },
      secondary: { main: '#00f7ff' },
      background: { default: '#0f0f0f' },
      text: { primary: '#ffffff' },
    },
  }),
  nature: createTheme({
    ...baseTheme,
    palette: {
      primary: { main: '#9ccc65' },
      secondary: { main: '#8bc34a' },
      background: { default: '#eaf0e0' },
      text: { primary: '#1b5e20' },
    },
  }),
};

export default themes.light; // Export light theme as default

export type ThemeNames = keyof typeof themes;