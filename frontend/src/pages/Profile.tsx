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

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      setEditModalOpen(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleShareWishlist = () => {
    setShareModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center mb-6">
          <AvatarUpload
            currentAvatar={user?.avatar}
            onAvatarUpdate={(newAvatar) => {
              // Handle avatar update logic
            }}
          />
          <div className="ml-4">
            <h1 className="text-3xl font-bold">{user?.name}</h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Bio</h2>
          <p className="text-gray-700">{user?.bio || 'No bio available.'}</p>
        </div>

        <div className="flex space-x-4 mb-6">
          <Button onClick={() => setEditModalOpen(true)} icon={<FaUser />}>
            Edit Profile
          </Button>
          <Button onClick={handleShareWishlist} icon={<FaShareAlt />}>
            Share Wishlist
          </Button>
        </div>

        <ActivityFeed userId={user?.id} />
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
        userId={user?.id}
      />
    </div>
  );
};

export default Profile;
