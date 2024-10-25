import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCodeBranch, FaRobot, FaHistory, FaMagic, FaCodeFork, FaMerge, FaGitAlt } from 'react-icons/fa';
import { usePlaylist } from '../../../contexts/PlaylistContext';
import { toast } from 'react-toastify';

interface PlaylistVersion {
  id: string;
  playlistId: string;
  parentVersionId?: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    type: 'human' | 'ai';
    avatar: string;
  };
  changes: {
    added: string[];
    removed: string[];
    reordered: boolean;
  };
  metadata: {
    aiGenerated?: boolean;
    confidence?: number;
    reason?: string;
    mood?: {
      energy: number;
      danceability: number;
      valence: number;
    };
  };
}

interface PlaylistFork {
  id: string;
  name: string;
  description: string;
  originalPlaylistId: string;
  forkedFrom: {
    id: string;
    name: string;
    owner: {
      username: string;
      avatar: string;
    };
  };
  divergencePoint: string; // Version ID where fork was created
  stats: {
    tracksAdded: number;
    tracksRemoved: number;
    totalChanges: number;
  };
}

const VersionControlContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  margin-top: 20px;
`;

const VersionList = styled.div`
  margin-top: 20px;
  max-height: 400px;
  overflow-y: auto;
`;

const VersionItem = styled(motion.div)<{ isAiGenerated?: boolean }>`
  background: ${({ isAiGenerated }) => 
    isAiGenerated ? 
    'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(79, 70, 229, 0.1))' : 
    'rgba(255, 255, 255, 0.05)'};
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }
`;

const ForkList = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
`;

const ForkCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 15px;
  cursor: pointer;
`;

const ActionButton = styled(motion.button)`
  background: linear-gradient(45deg, #43cea2, #185a9d);
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const PlaylistVersionControl: React.FC<{ playlistId: string }> = ({ playlistId }) => {
  const [versions, setVersions] = useState<PlaylistVersion[]>([]);
  const [forks, setForks] = useState<PlaylistFork[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<PlaylistVersion | null>(null);
  const [showForkModal, setShowForkModal] = useState(false);
  const { dispatch } = usePlaylist();

  useEffect(() => {
    fetchVersionHistory();
    fetchForks();
  }, [playlistId]);

  const fetchVersionHistory = async () => {
    try {
      const response = await fetch(`/api/playlists/${playlistId}/versions`);
      const data = await response.json();
      setVersions(data);
    } catch (error) {
      console.error('Failed to fetch version history:', error);
      toast.error('Could not load version history');
    }
  };

  const fetchForks = async () => {
    try {
      const response = await fetch(`/api/playlists/${playlistId}/forks`);
      const data = await response.json();
      setForks(data);
    } catch (error) {
      console.error('Failed to fetch forks:', error);
      toast.error('Could not load forks');
    }
  };

  const handleCreateFork = async () => {
    try {
      const response = await fetch(`/api/playlists/${playlistId}/fork`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Fork of ${playlistId}`,
          description: 'Forked playlist',
          version: selectedVersion?.id
        })
      });
      
      const newFork = await response.json();
      setForks(prev => [newFork, ...prev]);
      toast.success('🎵 Playlist forked successfully!');
      setShowForkModal(false);
    } catch (error) {
      console.error('Failed to create fork:', error);
      toast.error('Could not create fork');
    }
  };

  const handleRevertToVersion = async (version: PlaylistVersion) => {
    try {
      await fetch(`/api/playlists/${playlistId}/revert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ versionId: version.id })
      });
      
      toast.success('Reverted to previous version');
      // Refresh playlist data
      dispatch({ type: 'REFRESH_PLAYLIST' });
    } catch (error) {
      console.error('Failed to revert version:', error);
      toast.error('Could not revert to version');
    }
  };

  const handleMergeFork = async (forkId: string) => {
    try {
      await fetch(`/api/playlists/${playlistId}/merge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forkId })
      });
      
      toast.success('Fork merged successfully!');
      fetchVersionHistory();
    } catch (error) {
      console.error('Failed to merge fork:', error);
      toast.error('Could not merge fork');
    }
  };

  return (
    <VersionControlContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaGitAlt /> Version Control
        </h2>
        <div className="flex gap-4">
          <ActionButton
            onClick={() => setShowForkModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaCodeFork /> Fork Playlist
          </ActionButton>
        </div>
      </div>

      <VersionList>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaHistory /> Version History
        </h3>
        <AnimatePresence>
          {versions.map((version) => (
            <VersionItem
              key={version.id}
              isAiGenerated={version.metadata.aiGenerated}
              onClick={() => setSelectedVersion(version)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {version.metadata.aiGenerated ? (
                    <FaRobot className="text-purple-400" />
                  ) : (
                    <FaCodeBranch className="text-blue-400" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <img
                        src={version.author.avatar}
                        alt={version.author.username}
                        className="w-6 h-6 rounded-full"
                      />
                      <span>{version.author.username}</span>
                    </div>
                    <p className="text-sm opacity-70">
                      {version.changes.added.length} added, {version.changes.removed.length} removed
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRevertToVersion(version)}
                  className="px-3 py-1 bg-blue-500 rounded-full text-sm"
                >
                  Revert
                </button>
              </div>
              {version.metadata.aiGenerated && (
                <div className="mt-2 text-sm">
                  <div className="flex items-center gap-2">
                    <FaMagic className="text-purple-400" />
                    <span>AI Confidence: {version.metadata.confidence}%</span>
                  </div>
                  <p className="opacity-70">{version.metadata.reason}</p>
                </div>
              )}
            </VersionItem>
          ))}
        </AnimatePresence>
      </VersionList>

      <ForkList>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 col-span-full">
          <FaCodeFork /> Forks
        </h3>
        <AnimatePresence>
          {forks.map((fork) => (
            <ForkCard
              key={fork.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{fork.name}</h4>
                  <p className="text-sm opacity-70">by {fork.forkedFrom.owner.username}</p>
                </div>
                <button
                  onClick={() => handleMergeFork(fork.id)}
                  className="flex items-center gap-1 px-3 py-1 bg-green-500 rounded-full text-sm"
                >
                  <FaMerge /> Merge
                </button>
              </div>
              <div className="mt-2 text-sm">
                <p>+{fork.stats.tracksAdded} / -{fork.stats.tracksRemoved} tracks</p>
                <p>{fork.stats.totalChanges} total changes</p>
              </div>
            </ForkCard>
          ))}
        </AnimatePresence>
      </ForkList>
    </VersionControlContainer>
  );
};

export default PlaylistVersionControl;
