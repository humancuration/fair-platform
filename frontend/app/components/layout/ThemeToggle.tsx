import React from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon, FaLeaf, FaPalette, FaAdjust } from 'react-icons/fa';
import { useTheme } from '~/hooks/useTheme';

const themes = {
  light: { icon: FaSun, color: 'text-yellow-400' },
  dark: { icon: FaMoon, color: 'text-blue-400' },
  nature: { icon: FaLeaf, color: 'text-green-400' },
  retro: { icon: FaPalette, color: 'text-purple-400' },
  neon: { icon: FaAdjust, color: 'text-pink-400' }
} as const;

type ThemeType = keyof typeof themes;

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const currentTheme = theme as ThemeType;
  const ThemeIcon = themes[currentTheme]?.icon || themes.light.icon;

  const cycleTheme = () => {
    const themeKeys = Object.keys(themes) as ThemeType[];
    const currentIndex = themeKeys.indexOf(currentTheme);
    const nextTheme = themeKeys[(currentIndex + 1) % themeKeys.length];
    setTheme(nextTheme);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={cycleTheme}
      className={`p-2 rounded-full bg-opacity-20 ${themes[currentTheme]?.color || themes.light.color}`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.3 }}
      >
        <ThemeIcon className="w-5 h-5" />
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle; 