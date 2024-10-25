import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaBell, FaEnvelope, FaMobile, FaCog } from 'react-icons/fa';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'react-toastify';

const PreferencesContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  margin-top: 20px;
`;

const PreferenceSection = styled.div`
  margin-bottom: 20px;
`;

const ToggleSwitch = styled(motion.button)<{ isActive: boolean }>`
  width: 50px;
  height: 26px;
  background: ${({ isActive }) => isActive ? 
    'linear-gradient(45deg, #43cea2, #185a9d)' : 
    'rgba(255, 255, 255, 0.2)'};
  border-radius: 13px;
  position: relative;
  cursor: pointer;
  border: none;
  transition: background 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${({ isActive }) => isActive ? '27px' : '3px'};
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: left 0.3s ease;
  }
`;

const NotificationChannel = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  margin-bottom: 10px;

  .channel-info {
    display: flex;
    align-items: center;
    gap: 10px;

    svg {
      font-size: 1.2rem;
    }
  }
`;

const NotificationPreferences: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = async (channel: 'email' | 'push' | 'inApp') => {
    if (!user) return;

    setIsSaving(true);
    try {
      await updateUser({
        preferences: {
          ...user.preferences,
          notifications: {
            ...user.preferences.notifications,
            [channel]: !user.preferences.notifications[channel]
          }
        }
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <PreferencesContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <FaCog /> Notification Preferences
      </h2>

      <PreferenceSection>
        <NotificationChannel
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="channel-info">
            <FaBell />
            <div>
              <h3 className="font-semibold">In-App Notifications</h3>
              <p className="text-sm opacity-70">Receive notifications while using the app</p>
            </div>
          </div>
          <ToggleSwitch
            isActive={user.preferences.notifications.inApp}
            onClick={() => handleToggle('inApp')}
            disabled={isSaving}
            whileTap={{ scale: 0.95 }}
          />
        </NotificationChannel>

        <NotificationChannel
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="channel-info">
            <FaEnvelope />
            <div>
              <h3 className="font-semibold">Email Notifications</h3>
              <p className="text-sm opacity-70">Get updates in your inbox</p>
            </div>
          </div>
          <ToggleSwitch
            isActive={user.preferences.notifications.email}
            onClick={() => handleToggle('email')}
            disabled={isSaving}
            whileTap={{ scale: 0.95 }}
          />
        </NotificationChannel>

        <NotificationChannel
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="channel-info">
            <FaMobile />
            <div>
              <h3 className="font-semibold">Push Notifications</h3>
              <p className="text-sm opacity-70">Receive mobile push notifications</p>
            </div>
          </div>
          <ToggleSwitch
            isActive={user.preferences.notifications.push}
            onClick={() => handleToggle('push')}
            disabled={isSaving}
            whileTap={{ scale: 0.95 }}
          />
        </NotificationChannel>
      </PreferenceSection>
    </PreferencesContainer>
  );
};

export default NotificationPreferences;
