import React from 'react';
import { useTheme } from '~/hooks/useTheme';

const ThemeCustomizer: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-customizer p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Customize Your Experience</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Theme</label>
          <select 
            value={theme}
            onChange={(e) => toggleTheme()}
            className="w-full p-2 border rounded"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;