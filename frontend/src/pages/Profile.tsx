import React, { useState } from 'react';
import Modal from '../components/Modal';

const Profile: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <button onClick={() => setModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
        Edit Profile
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Edit Your Profile</h2>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" className="border rounded px-3 py-2 w-full" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="border rounded px-3 py-2 w-full" />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Save
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;