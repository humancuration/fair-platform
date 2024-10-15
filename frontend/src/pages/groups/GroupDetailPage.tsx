import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroupById, updateGroupProfile } from '../../store/slices/groupsSlice';
import { RootState } from '../../store/store';
import GroupProfile from '../../components/groups/GroupProfile';
import GroupTestimonials from '../../components/groups/GroupTestimonials';
import GroupSupportChannels from '../../components/groups/GroupSupportChannels';
import GroupPromotion from '../../components/groups/GroupPromotion';
import ShareWithGroupModal from '../../components/shared/ShareWithGroupModal';
import api from '@api/api';
import { toast } from 'react-toastify';

const GroupDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const group = useSelector((state: RootState) => state.groups.groups.find(g => g.id === Number(id)));
  const [isEditing, setIsEditing] = useState(false);
  const [editedGroup, setEditedGroup] = useState(group);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (id) {
      dispatch(fetchGroupById(Number(id)));
      fetchGroupMembers();
    }
  }, [id, dispatch]);

  const fetchGroupMembers = async () => {
    try {
      const response = await api.get(`/groups/${id}/members`);
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching group members:', error);
      toast.error('Failed to load group members.');
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedGroup(group);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedGroup(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      await dispatch(updateGroupProfile({ id: Number(id), profileData: editedGroup }));
      setIsEditing(false);
      toast.success('Group profile updated successfully!');
    } catch (error) {
      console.error('Error updating group profile:', error);
      toast.error('Failed to update group profile.');
    }
  };

  if (!group) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-48 w-full object-cover md:w-48" src={group.coverPhoto || 'default-cover.jpg'} alt={`${group.name} cover`} />
          </div>
          <div className="p-8 w-full">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-gray-800">{group.name}</h1>
              {!isEditing && (
                <button onClick={handleEditToggle} className="bg-blue-500 text-white px-4 py-2 rounded">
                  Edit Profile
                </button>
              )}
            </div>
            {isEditing ? (
              <form onSubmit={handleSaveChanges} className="space-y-4">
                <input
                  name="name"
                  value={editedGroup.name}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                />
                <textarea
                  name="description"
                  value={editedGroup.description}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                />
                <textarea
                  name="vision"
                  value={editedGroup.vision}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Group Vision"
                />
                <textarea
                  name="mission"
                  value={editedGroup.mission}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Group Mission"
                />
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                  Save Changes
                </button>
                <button onClick={handleEditToggle} className="bg-gray-300 text-gray-800 px-4 py-2 rounded ml-2">
                  Cancel
                </button>
              </form>
            ) : (
              <GroupProfile group={group} />
            )}
          </div>
        </div>
        
        <div className="p-8 border-t">
          <h2 className="text-2xl font-semibold mb-4">Group Members</h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {members.map(member => (
              <li key={member.id} className="flex items-center space-x-2">
                <img src={member.avatar || 'default-avatar.jpg'} alt={member.name} className="w-10 h-10 rounded-full" />
                <span>{member.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-8 border-t">
          <h2 className="text-2xl font-semibold mb-4">Group Resources</h2>
          {/* Add a component or logic to display and manage group resources */}
        </div>

        <div className="p-8 border-t">
          <h2 className="text-2xl font-semibold mb-4">Group Petitions</h2>
          {/* Add a component to display and manage group petitions */}
        </div>

        <div className="p-8 border-t">
          <GroupTestimonials />
        </div>

        <div className="p-8 border-t">
          <GroupSupportChannels />
        </div>

        <div className="p-8 border-t">
          <h2 className="text-2xl font-semibold mb-4">Promote Group</h2>
          <GroupPromotion groupId={id} />
        </div>

        <div className="p-8 border-t flex justify-between items-center">
          <Link to="/groups" className="bg-gray-300 text-gray-800 px-4 py-2 rounded">
            Back to Groups
          </Link>
          <button onClick={() => setIsShareModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
            Share Group
          </button>
        </div>
      </div>

      <ShareWithGroupModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        productId={id} // Assuming we're sharing the group itself
      />
    </div>
  );
};

export default GroupDetailPage;
