import { Form, useActionData, useTransition } from '@remix-run/react';
import { motion } from 'framer-motion';
import { FormInput, FormContainer } from './FormElements';
import type { ActionData } from '~/types/forms';

interface SettingsFormProps {
  initialValues: {
    notificationsEnabled: boolean;
    theme: 'light' | 'dark';
    fediverseProfile?: string;
  };
}

export default function SettingsForm({ initialValues }: SettingsFormProps) {
  const actionData = useActionData<ActionData>();
  const transition = useTransition();
  const isSubmitting = transition.state === "submitting";

  return (
    <FormContainer
      as={Form}
      method="post"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="notificationsEnabled"
            name="notificationsEnabled"
            defaultChecked={initialValues.notificationsEnabled}
          />
          <label htmlFor="notificationsEnabled">
            Enable Notifications
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Theme</label>
          <select
            name="theme"
            className="w-full p-2 border rounded"
            defaultValue={initialValues.theme}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <FormInput
          name="fediverseProfile"
          label="Fediverse Profile URL"
          type="url"
          defaultValue={initialValues.fediverseProfile}
        />

        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded
                   hover:bg-blue-600 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </motion.button>

        {actionData?.error && (
          <div className="text-red-500 text-sm">{actionData.error}</div>
        )}
      </div>
    </FormContainer>
  );
}
