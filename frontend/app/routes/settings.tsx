import { json, redirect, type LoaderFunction, type ActionFunction } from '@remix-run/node';
import { useLoaderData, useActionData, Form } from '@remix-run/react';
import { motion } from 'framer-motion';
import { requireUser } from '~/services/auth.server';
import { getUserSettings, updateUserSettings } from '~/services/user.server';
import type { UserSettings } from '~/types';

interface LoaderData {
  settings: UserSettings;
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  const settings = await getUserSettings(user.id);
  return json<LoaderData>({ settings });
};

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request);
  const formData = await request.formData();

  const settings = {
    receiveNewsletter: formData.get('receiveNewsletter') === 'on',
    darkMode: formData.get('darkMode') === 'on',
    language: formData.get('language') as string,
    timezone: formData.get('timezone') as string,
  };

  try {
    await updateUserSettings(user.id, settings);
    return redirect('/settings');
  } catch (error) {
    return json({ error: 'Failed to update settings' }, { status: 400 });
  }
};

export default function Settings() {
  const { settings } = useLoaderData<typeof loader>();
  const actionData = useActionData();

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <Form method="post" className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="receiveNewsletter"
                  name="receiveNewsletter"
                  defaultChecked={settings.receiveNewsletter}
                  className="mr-2"
                />
                <label htmlFor="receiveNewsletter">
                  Receive Newsletter
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="darkMode"
                  name="darkMode"
                  defaultChecked={settings.darkMode}
                  className="mr-2"
                />
                <label htmlFor="darkMode">
                  Dark Mode
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Language
                </label>
                <select
                  name="language"
                  defaultValue={settings.language}
                  className="w-full p-2 border rounded"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Timezone
                </label>
                <select
                  name="timezone"
                  defaultValue={settings.timezone}
                  className="w-full p-2 border rounded"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
            </div>
          </div>

          {actionData?.error && (
            <div className="text-red-500 text-sm mt-2">
              {actionData.error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </Form>
      </motion.div>
    </div>
  );
}
