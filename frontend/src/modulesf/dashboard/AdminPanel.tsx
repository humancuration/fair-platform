import React, { useState, useCallback } from 'react';

const AdminPanel: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prevMode => !prevMode);
  }, []);

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} rounded shadow transition-colors duration-300`}>
      <h3 className="text-2xl font-semibold mb-4">Welcome to the Admin Dashboard</h3>
      <button
        onClick={toggleTheme}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
      >
        Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
      </button>
      <p>Use the sidebar to navigate through admin functionalities.</p>
      {/* Add admin-specific content here */}
    </div>
  );
};

export default React.memo(AdminPanel);
