import React, { useState, useEffect } from 'react';

const ThemeToggle: React.FC = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('high-contrast', isHighContrast);
  }, [isHighContrast]);

  const toggleTheme = () => {
    setIsHighContrast(!isHighContrast);
  };

  return (
    <button onClick={toggleTheme} aria-pressed={isHighContrast}>
      {isHighContrast ? 'Switch to Normal Contrast' : 'Switch to High Contrast'}
    </button>
  );
};

export default ThemeToggle;