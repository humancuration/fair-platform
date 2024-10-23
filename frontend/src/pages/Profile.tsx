import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { updateUserProfile } from '../store/slices/userSlice';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import TextInput from '../components/forms/TextInput';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaShareAlt } from 'react-icons/fa';
import AvatarUpload from '../components/AvatarUpload';
import ActivityFeed from '../components/ActivityFeed';
import ShareWishlistModal from '../components/ShareWishlistModal';
import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { GET_USER_ACTIVITY } from '../graphql/queries';
import type { User, Activity } from '../types';

interface LoaderData {
  user: User;
  initialActivities: Activity[];
}

export const loader: LoaderFunction = async ({ request }) => {
  // Server-side auth check and data fetching
  const user = await requireUser(request);
  const initialActivities = await getUserActivities(user.id);
  
  return json<LoaderData>({ user, initialActivities });
};

const Profile: React.FC = () => {
  const { user, initialActivities } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();
  
  const { data: activityData } = useQuery(GET_USER_ACTIVITY, {
    variables: { userId: user.id },
    fetchPolicy: 'cache-and-network',
  });

  const activities = activityData?.activities || initialActivities;

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

        <div className="flex space-x-4 mb-6">
          <Button onClick={() => setEditModalOpen(true)} icon={<FaUser />}>
            Edit Profile
          </Button>
          <Button onClick={handleShareWishlist} icon={<FaShareAlt />}>
            Share Wishlist
          </Button>
        </div>

        <ActivityFeed userId={user.id} />
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
        <h2 className="text-2xl font-semibold mb-4">Edit Your Profile</h2>
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            icon={<FaUser />}
          />
          <TextInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            icon={<FaEnvelope />}
          />
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>
          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </Modal>

      <ShareWishlistModal
        isOpen={isShareModalOpen}
        onClose={() => setShareModalOpen(false)}
        userId={user.id}
      />

      <AnimatePresence>
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: index * 0.1 }}
            className="mb-4"
          >
            <ActivityCard activity={activity} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default Profile;
