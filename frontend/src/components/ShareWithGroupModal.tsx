import React, { useEffect, useState } from 'react';
import Modal from '@/components/common/Modal';
import api from '@api/api';
import { toast } from 'react-toastify';

interface ShareWithGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string;
  affiliateLinkId?: string;
  playlistId?: string;
}

const ShareWithGroupModal: React.FC<ShareWithGroupModalProps> = ({
  isOpen,
  onClose,
  productId,
  affiliateLinkId,
  playlistId,
}) => {
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get('/groups');
        setGroups(response.data);
        if (response.data.length > 0) {
          setSelectedGroup(response.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
        toast.error('Failed to load groups.');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchGroups();
    }
  }, [isOpen]);

  const handleShare = async () => {
    try {
      const payload: any = { groupId: selectedGroup };
      if (productId) payload.productId = productId;
      if (affiliateLinkId) payload.affiliateLinkId = affiliateLinkId;
      if (playlistId) payload.playlistId = playlistId;

      await api.post('/share', payload);
      toast.success('Shared successfully!');
      onClose();
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share with Group">
      <div className="space-y-4">
        {loading ? (
          <p>Loading groups...</p>
        ) : (
          <>
            <label>Select Group:</label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
            <button onClick={handleShare} className="bg-blue-500 text-white px-4 py-2 rounded">
              Share
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ShareWithGroupModal;
