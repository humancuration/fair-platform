import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMusic, FaUsers, FaMagic, FaPlay, FaHeart, FaShare } from 'react-icons/fa';
import { usePlaylist } from '../../contexts/PlaylistContext';
import { formatDuration, formatDate } from '../../utils/formatters';

interface MediaItem {
  id: string;
  type: 'music' | 'video' | 'social' | 'podcast';
  title: string;
  url: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  mediaItems: MediaItem[];
  ownerId: string;
  groupId?: string;
  createdAt: string;
  totalDuration: number;
  playCount: number;
}

interface PlaylistCardProps {
  playlist: Playlist;
}

const EnchantedCard = styled(motion.div)`
  background: linear-gradient(45deg, #43cea2, #185a9d);
  border-radius: 15px;
  padding: 20px;
  color: #fff;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.05)
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const PlaylistTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const MagicalLink = styled(Link)`
  display: inline-block;
  margin-top: 15px;
  padding: 8px 15px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: #fff;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }
`;

const PlaylistControls = styled(motion.div)`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const ControlButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const PlaylistStats = styled(motion.div)`
  display: flex;
  gap: 15px;
  margin-top: 10px;
  font-size: 0.9rem;
  opacity: 0.9;
`;

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  const { dispatch } = usePlaylist();
  const [isHovered, setIsHovered] = useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_PLAYLIST', payload: playlist });
    dispatch({ type: 'SET_TRACK_INDEX', payload: 0 });
    dispatch({ type: 'TOGGLE_PLAY' });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    // Implement sharing functionality
    navigator.share?.({
      title: playlist.name,
      text: playlist.description,
      url: `/playlists/${playlist.id}`,
    }).catch(console.error);
  };

  return (
    <EnchantedCard
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <PlaylistTitle>
        <FaMusic /> {playlist.name}
      </PlaylistTitle>
      <p>{playlist.description}</p>
      
      <PlaylistStats
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span><FaMagic /> {playlist.mediaItems.length} tracks</span>
        <span>{formatDuration(playlist.totalDuration)}</span>
        <span>{playlist.playCount} plays</span>
      </PlaylistStats>

      <AnimatePresence>
        {isHovered && (
          <PlaylistControls
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <ControlButton onClick={handlePlay}>
              <FaPlay />
            </ControlButton>
            <ControlButton>
              <FaHeart />
            </ControlButton>
            <ControlButton onClick={handleShare}>
              <FaShare />
            </ControlButton>
          </PlaylistControls>
        )}
      </AnimatePresence>

      {playlist.groupId && (
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-block bg-purple-200 text-purple-800 px-2 py-1 rounded mt-2"
        >
          <FaUsers /> Group Playlist
        </motion.span>
      )}

      <MagicalLink to={`/playlists/${playlist.id}`}>
        Explore Playlist
      </MagicalLink>
    </EnchantedCard>
  );
};

export default PlaylistCard;
