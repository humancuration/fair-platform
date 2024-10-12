// frontend/src/pages/SettingsPage.tsx

import React, { useEffect, useState } from 'react';
import api from '@api/api';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../store/slices/themeSlice'; // Create a theme slice
import { RootState } from '../store/store';
import { toast } from 'react-toastify';
import Select from '../components/Select';
import TextInput from '../components/forms/TextInput';
import Checkbox from '../components/forms/Checkbox';

interface Settings {
  receiveNewsletter: boolean;
  darkMode: boolean;
  language: string; // Add language to settings
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    receiveNewsletter: false,
    darkMode: false,
    language: 'en', // Default language
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.darkMode);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/settings'); // Implement this endpoint
      setSettings(response.data);
      dispatch(toggleDarkMode(response.data.darkMode));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load settings. Please try again later.');
      setLoading(false);
    }
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
    if (name === 'darkMode') {
      dispatch(toggleDarkMode(checked));
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings((prev) => ({
      ...prev,
      language: e.target.value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/user/settings', settings); // Implement this endpoint
      toast.success('Settings updated successfully!');
    } catch (err) {
      console.error('Error updating settings:', err);
      setError('Failed to update settings. Please try again.');
      toast.error('Failed to update settings. Please try again.');
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) return <div>Loading settings...</div>;
  if (error) return <div>Error: {error}</div>;

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    // Add more languages as needed
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <form onSubmit={handleSave} className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="receiveNewsletter"
            checked={settings.receiveNewsletter}
            onChange={handleToggle}
            className="mr-2"
          />
          <label className="text-sm">Receive Newsletter</label>
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="darkMode"
            checked={settings.darkMode}
            onChange={handleToggle}
            className="mr-2"
          />
          <label className="text-sm">Enable Dark Mode</label>
        </div>
        <Select
          label="Preferred Language"
          name="language"
          value={settings.language}
          onChange={handleLanguageChange}
          options={languageOptions}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
