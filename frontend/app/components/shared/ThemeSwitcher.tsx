// src/components/ThemeSwitcher.tsx

import React from 'react';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) return null;

  const { switchTheme } = themeContext;

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => switchTheme('retro')}
        className="px-3 py-1 bg-red-500 text-white rounded"
      >
        Retro
      </button>
      <button
        onClick={() => switchTheme('neon')}
        className="px-3 py-1 bg-pink-500 text-white rounded"
      >
        Neon
      </button>
      <button
        onClick={() => switchTheme('nature')}
        className="px-3 py-1 bg-green-500 text-white rounded"
      >
        Nature
      </button>
      <button
        onClick={() => switchTheme('light')}
        className="px-3 py-1 bg-gray-200 text-gray-800 rounded"
      >
        Light
      </button>
      <button
        onClick={() => switchTheme('dark')}
        className="px-3 py-1 bg-gray-800 text-white rounded"
      >
        Dark
      </button>
    </div>
  );
};

export default ThemeSwitcher;
