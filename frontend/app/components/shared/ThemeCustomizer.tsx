import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setTheme, setCustomStyle } from '../modules/store/themeSlice';

const ThemeCustomizer: React.FC = () => {
  const dispatch = useDispatch();
  const { currentTheme, customStyles } = useSelector((state: RootState) => state.theme);

  const handleThemeChange = (theme: string) => {
    dispatch(setTheme(theme));
  };

  const handleCustomStyleChange = (key: string, value: string) => {
    dispatch(setCustomStyle({ key, value }));
  };

  return (
    <div className="theme-customizer">
      <h3>Customize Your Dashboard</h3>
      <select value={currentTheme} onChange={(e) => handleThemeChange(e.target.value)}>
        <option value="default">Default</option>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
      {/* Add more customization options here */}
    </div>
  );
};

export default ThemeCustomizer;