import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    allowSearchAnalytics: false,
    allowBehavioralTracking: false,
    dataRetentionPeriod: 365, // days
    anonymizeData: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/user/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to fetch user settings. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = async (setting: string, value: boolean | number) => {
    try {
      await axios.patch('/api/user/settings', { [setting]: value });
      setSettings(prev => ({ ...prev, [setting]: value }));
      toast.success('Setting updated successfully');
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Failed to update setting. Please try again.');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="user-settings">
      <h2>Data Collection and Privacy Settings</h2>
      <div className="setting-item">
        <label>
          <input
            type="checkbox"
            checked={settings.allowSearchAnalytics}
            onChange={(e) => handleSettingChange('allowSearchAnalytics', e.target.checked)}
          />
          Allow search data collection to improve search results
        </label>
      </div>
      <div className="setting-item">
        <label>
          <input
            type="checkbox"
            checked={settings.allowBehavioralTracking}
            onChange={(e) => handleSettingChange('allowBehavioralTracking', e.target.checked)}
          />
          Allow behavioral tracking for personalized recommendations
        </label>
      </div>
      <div className="setting-item">
        <label>
          Data retention period (days):
          <input
            type="number"
            value={settings.dataRetentionPeriod}
            onChange={(e) => handleSettingChange('dataRetentionPeriod', parseInt(e.target.value))}
            min="1"
            max="3650"
          />
        </label>
      </div>
      <div className="setting-item">
        <label>
          <input
            type="checkbox"
            checked={settings.anonymizeData}
            onChange={(e) => handleSettingChange('anonymizeData', e.target.checked)}
          />
          Anonymize my data after retention period instead of deleting
        </label>
      </div>
    </div>
  );
};

export default UserSettings;