// src/styles/theme.ts

export const themes = {
  retro: {
    background: '#f3eac2',
    primary: '#ff6f61',
    secondary: '#ffec5c',
    text: '#2f1b0c',
  },
  neon: {
    background: '#0f0f0f',
    primary: '#ff007f',
    secondary: '#00f7ff',
    text: '#ffffff',
  },
  nature: {
    background: '#eaf0e0',
    primary: '#9ccc65',
    secondary: '#8bc34a',
    text: '#1b5e20',
  },
};

export type Theme = typeof themes.retro;