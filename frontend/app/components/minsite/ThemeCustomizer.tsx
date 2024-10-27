import { useState } from "react";
import { motion } from "framer-motion";
import type { Theme } from "~/types/minsite";

interface ThemeCustomizerProps {
  theme: Theme;
  onChange: (theme: Theme) => void;
}

export function ThemeCustomizer({ theme, onChange }: ThemeCustomizerProps) {
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'spacing'>('colors');

  const handleColorChange = (key: keyof Theme['colors'], value: string) => {
    onChange({
      ...theme,
      colors: {
        ...theme.colors,
        [key]: value
      }
    });
  };

  const handleFontChange = (key: keyof Theme['typography'], value: string) => {
    onChange({
      ...theme,
      typography: {
        ...theme.typography,
        [key]: value
      }
    });
  };

  return (
    <div className="theme-customizer p-4 bg-white rounded-lg shadow">
      <div className="flex gap-2 mb-4">
        {(['colors', 'typography', 'spacing'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded ${
              activeTab === tab 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        {activeTab === 'colors' && (
          <>
            {Object.entries(theme.colors).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <label className="w-32 text-sm text-gray-700">{key}</label>
                <input
                  type="color"
                  value={value}
                  onChange={e => handleColorChange(key as keyof Theme['colors'], e.target.value)}
                  className="w-8 h-8 rounded"
                />
                <input
                  type="text"
                  value={value}
                  onChange={e => handleColorChange(key as keyof Theme['colors'], e.target.value)}
                  className="flex-1 p-1 text-sm border rounded"
                />
              </div>
            ))}
          </>
        )}

        {activeTab === 'typography' && (
          <>
            {Object.entries(theme.typography).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <label className="w-32 text-sm text-gray-700">{key}</label>
                <select
                  value={value}
                  onChange={e => handleFontChange(key as keyof Theme['typography'], e.target.value)}
                  className="flex-1 p-1 text-sm border rounded"
                >
                  <option value="sans-serif">Sans Serif</option>
                  <option value="serif">Serif</option>
                  <option value="monospace">Monospace</option>
                </select>
              </div>
            ))}
          </>
        )}
      </motion.div>
    </div>
  );
}
