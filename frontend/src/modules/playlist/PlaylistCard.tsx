import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaMusic, FaUsers, FaMagic } from 'react-icons/fa';

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
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
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

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  return (
    <EnchantedCard
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <PlaylistTitle>
        <FaMusic /> {playlist.name}
      </PlaylistTitle>
      <p>{playlist.description}</p>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <FaMagic /> Magical Items: {playlist.mediaItems.length}
      </motion.p>
      {playlist.groupId && (
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-block bg-purple-200 text-purple-800 px-2 py-1 rounded mt-2"
        >
          <FaUsers /> Enchanted Group Playlist
        </motion.span>
      )}
      <MagicalLink to={`/playlists/${playlist.id}`}>
        Explore the Magic
      </MagicalLink>
    </EnchantedCard>
  );
};

export default PlaylistCard;
