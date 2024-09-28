// src/components/ThemeSwitcher.tsx

import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) return null;

  const { switchTheme } = themeContext;

  return (
    <div className="theme-switcher">
      <button onClick={() => switchTheme('retro')}>Retro</button>
      <button onClick={() => switchTheme('neon')}>Neon</button>
      <button onClick={() => switchTheme('nature')}>Nature</button>
    </div>
  );
};

export default ThemeSwitcher;
