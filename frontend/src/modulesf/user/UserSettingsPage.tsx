import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SettingsForm from '../components/forms/SettingsForm';
import { updateUserSettings } from '../store/slices/userSettingsSlice';
import { toast } from 'react-toastify';

const UserSettingsPage: React.FC = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.userSettings);

  const handleSave = (updatedSettings: any) => {
    dispatch(updateUserSettings(updatedSettings))
      .unwrap()
      .then(() => {
        toast.success('Settings updated successfully!');
      })
      .catch((error) => {
        toast.error(`Failed to update settings: ${error}`);
      });
  };

  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">User Settings</h1>
        <SettingsForm initialValues={settings} onSave={handleSave} />
      </main>
      <Footer />
    </div>
  );
};

export default UserSettingsPage;