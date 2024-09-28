// src/contexts/ThemeContext.tsx

import React, { createContext, useState, ReactNode } from 'react';
import { themes, Theme } from '../styles/theme';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

interface ThemeContextProps {
  theme: Theme;
  switchTheme: (themeName: keyof typeof themes) => void;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(themes.retro);

  const switchTheme = (themeName: keyof typeof themes) => {
    setTheme(themes[themeName]);
  };

  return (
    <ThemeContext.Provider value={{ theme, switchTheme }}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
