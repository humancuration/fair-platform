import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlaylist } from '../../../contexts/PlaylistContext';
import { FaUsers, FaLock, FaUnlock, FaHistory, FaCrown } from 'react-icons/fa';
import { toast } from 'react-toastify';
import styled from 'styled-components';

interface CollaboratorAction {
  userId: string;
  username: string;
  action: 'add' | 'remove' | 'reorder' | 'update';
  timestamp: string;
  trackInfo?: {
    id: string;
    title: string;
  };
}

const CollaborativeContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  margin-top: 20px;
`;

const CollaboratorList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 15px;
`;

const CollaboratorCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ActivityFeed = styled.div`
  margin-top: 20px;
  max-height: 300px;
  overflow-y: auto;
`;

const ActivityItem = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PermissionToggle = styled.button<{ isPublic: boolean }>`
  background: ${({ isPublic }) => 
    isPublic ? 'rgba(72, 187, 120, 0.2)' : 'rgba(247, 64, 64, 0.2)'};
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background: ${({ isPublic }) => 
      isPublic ? 'rgba(72, 187, 120, 0.3)' : 'rgba(247, 64, 64, 0.3)'};
  }
`;

const CollaborativePlaylist: React.FC<{ playlistId: string }> = ({ playlistId }) => {
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [activityHistory, setActivityHistory] = useState<CollaboratorAction[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const { dispatch } = usePlaylist();

  useEffect(() => {
    fetchCollaborators();
    fetchActivityHistory();
  }, [playlistId]);

  const fetchCollaborators = async () => {
    try {
      const response = await fetch(`/api/playlists/${playlistId}/collaborators`);
      const data = await response.json();
      setCollaborators(data);
    } catch (error) {
      console.error('Failed to fetch collaborators:', error);
      toast.error('Could not load collaborators');
    }
  };

  const fetchActivityHistory = async () => {
    try {
      const response = await fetch(`/api/playlists/${playlistId}/activity`);
      const data = await response.json();
      setActivityHistory(data);
    } catch (error) {
      console.error('Failed to fetch activity history:', error);
    }
  };

  const togglePublicAccess = async () => {
    try {
      await fetch(`/api/playlists/${playlistId}/access`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !isPublic })
      });
      setIsPublic(!isPublic);
      toast.success(`Playlist is now ${!isPublic ? 'public' : 'private'}`);
    } catch (error) {
      console.error('Failed to toggle access:', error);
      toast.error('Failed to update playlist access');
    }
  };

  const removeCollaborator = async (userId: string) => {
    try {
      await fetch(`/api/playlists/${playlistId}/collaborators/${userId}`, {
        method: 'DELETE'
      });
      setCollaborators(prev => prev.filter(c => c.id !== userId));
      toast.success('Collaborator removed');
    } catch (error) {
      console.error('Failed to remove collaborator:', error);
      toast.error('Could not remove collaborator');
    }
  };

  return (
    <CollaborativeContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaUsers /> Collaboration Hub
        </h2>
        <PermissionToggle
          isPublic={isPublic}
          onClick={togglePublicAccess}
        >
          {isPublic ? <FaUnlock /> : <FaLock />}
          {isPublic ? 'Public' : 'Private'} Playlist
        </PermissionToggle>
      </div>

      <CollaboratorList>
        <AnimatePresence>
          {collaborators.map((collaborator) => (
            <CollaboratorCard
              key={collaborator.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <img
                src={collaborator.avatar}
                alt={collaborator.username}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span>{collaborator.username}</span>
                  {collaborator.isOwner && <FaCrown className="text-yellow-400" />}
                </div>
                <span className="text-sm opacity-60">{collaborator.role}</span>
              </div>
              {!collaborator.isOwner && (
                <button
                  onClick={() => removeCollaborator(collaborator.id)}
                  className="ml-auto text-red-400 hover:text-red-500"
                >
                  Remove
                </button>
              )}
            </CollaboratorCard>
          ))}
        </AnimatePresence>
      </CollaboratorList>

      <ActivityFeed>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaHistory /> Recent Activity
        </h3>
        <AnimatePresence>
          {activityHistory.map((activity, index) => (
            <ActivityItem
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
            >
              <img
                src={`/api/users/${activity.userId}/avatar`}
                alt={activity.username}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <span className="font-semibold">{activity.username}</span>
                {' '}
                {activity.action === 'add' && 'added'}
                {activity.action === 'remove' && 'removed'}
                {activity.action === 'reorder' && 'reordered'}
                {activity.action === 'update' && 'updated'}
                {activity.trackInfo && (
                  <span className="font-semibold"> "{activity.trackInfo.title}"</span>
                )}
                <div className="text-sm opacity-60">
                  {new Date(activity.timestamp).toLocaleString()}
                </div>
              </div>
            </ActivityItem>
          ))}
        </AnimatePresence>
      </ActivityFeed>
    </CollaborativeContainer>
  );
};

export default CollaborativePlaylist;
