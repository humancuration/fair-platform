import { json, type LoaderFunction } from '@remix-run/node';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';
import AvatarUpload from '~/components/AvatarUpload';
import ActivityFeed from '~/components/ActivityFeed';
import { requireUser } from '~/services/auth.server';
import { getUserActivities } from '~/services/activity.server';
import type { User, Activity } from '~/types';

interface LoaderData {
  user: User;
  activities: Activity[];
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  const activities = await getUserActivities(user.id);
  
  return json<LoaderData>({ user, activities });
};

export default function Profile() {
  const { user, activities } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4"
    >
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div className="flex items-center mb-6">
          <AvatarUpload
            currentAvatar={user.avatar}
            onAvatarUpdate={async (file) => {
              const formData = new FormData();
              formData.append('avatar', file);
              fetcher.submit(formData, {
                method: 'post',
                action: '/api/avatar',
                encType: 'multipart/form-data'
              });
            }}
          />
          <div className="ml-4">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Bio</h2>
          <p className="text-gray-700">{user.bio || 'No bio available.'}</p>
        </div>

        <ActivityFeed activities={activities} />
      </div>
    </motion.div>
  );
}
