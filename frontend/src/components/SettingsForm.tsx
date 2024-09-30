import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { updateUserSettings } from '../store/slices/userSettingsSlice';
import api from '../utils/api';
import { toast } from 'react-toastify';
import TextInput from './forms/TextInput';
import Button from './Button';

const SettingsForm: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const userSettings = useSelector((state: RootState) => state.userSettings);

  const formik = useFormik({
    initialValues: {
      notificationsEnabled: userSettings.notificationsEnabled,
      theme: userSettings.theme,
      fediverseProfile: user.fediverseProfile || '',
    },
    validationSchema: Yup.object({
      fediverseProfile: Yup.string().url('Invalid URL').optional(),
      // ... other validations
    }),
    onSubmit: async (values) => {
      try {
        await api.patch(`/user/${user.id}/settings`, values);
        dispatch(updateUserSettings(values));
        toast.success('Settings updated successfully!');
      } catch (error) {
        console.error('Error updating settings:', error);
        toast.error('Failed to update settings.');
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* ... existing form fields */}
      <TextInput
        label="Fediverse Profile URL (optional)"
        name="fediverseProfile"
        type="url"
        {...formik.getFieldProps('fediverseProfile')}
      />
      <Button type="submit">Save Settings</Button>
    </form>
  );
};

export default SettingsForm;