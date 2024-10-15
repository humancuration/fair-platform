import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '../common/Button';

interface SettingsFormProps {
  initialValues: {
    notificationsEnabled: boolean;
    theme: string;
    fediverseProfile: string;
  };
  onSave: (values: any) => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ initialValues, onSave }) => {
  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      fediverseProfile: Yup.string().url('Invalid URL').nullable(),
    }),
    onSubmit: (values) => {
      onSave(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="notificationsEnabled" className="block text-sm font-medium">
          Enable Notifications
        </label>
        <input
          id="notificationsEnabled"
          type="checkbox"
          {...formik.getFieldProps('notificationsEnabled')}
          className="mt-1 p-2"
        />
      </div>

      <div>
        <label htmlFor="theme" className="block text-sm font-medium">
          Theme
        </label>
        <select
          id="theme"
          {...formik.getFieldProps('theme')}
          className="mt-1 p-2 w-full border rounded"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div>
        <label htmlFor="fediverseProfile" className="block text-sm font-medium">
          Fediverse Profile URL
        </label>
        <input
          id="fediverseProfile"
          type="url"
          placeholder="https://mastodon.social/@yourusername"
          {...formik.getFieldProps('fediverseProfile')}
          className="mt-1 p-2 w-full border rounded"
        />
        {formik.touched.fediverseProfile && formik.errors.fediverseProfile ? (
          <div className="text-red-500 text-sm">{formik.errors.fediverseProfile}</div>
        ) : null}
      </div>

      <Button type="submit">Save Settings</Button>
    </form>
  );
};

export default SettingsForm;