import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMagic, FaPlus } from 'react-icons/fa';
import { usePlaylist } from '../../../contexts/PlaylistContext';
import { MediaItem } from '../../../types/playlist';

interface RecommendedTrack extends MediaItem {
  confidence: number;
  reason: string;
}

const RecommendationsContainer = styled(motion.div)`
  background: linear-gradient(135deg, rgba(110, 72, 170, 0.1), rgba(157, 80, 187, 0.1));
  border-radius: 15px;
  padding: 20px;
  margin-top: 20px;
`;

const RecommendationCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ConfidenceBadge = styled.div<{ confidence: number }>`
  background: ${({ confidence }) => `
    linear-gradient(45deg, 
      ${confidence > 80 ? '#43cea2' : confidence > 60 ? '#ffb347' : '#ff6b6b'},
      ${confidence > 80 ? '#185a9d' : confidence > 60 ? '#ffcc33' : '#ff4949'}
    )
  `};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
`;

const AddButton = styled(motion.button)`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const PlaylistRecommendations: React.FC<{ playlistId: string }> = ({ playlistId }) => {
  const [recommendations, setRecommendations] = useState<RecommendedTrack[]>([]);
  const { dispatch } = usePlaylist();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(`/api/playlists/${playlistId}/recommendations`);
        const data = await response.json();
        setRecommendations(data);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      }
    };

    fetchRecommendations();
  }, [playlistId]);

  const handleAddTrack = (track: RecommendedTrack) => {
    dispatch({ type: 'ADD_TO_QUEUE', payload: track });
    setRecommendations(prev => prev.filter(t => t.id !== track.id));
  };

  return (
    <RecommendationsContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl mb-4 flex items-center gap-2">
        <FaMagic /> Magical Recommendations
      </h2>
      
      <AnimatePresence mode="popLayout">
        {recommendations.map((track) => (
          <RecommendationCard
            key={track.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            layout
          >
            <div>
              <h3>{track.title}</h3>
              <p className="text-sm opacity-70">{track.reason}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <ConfidenceBadge confidence={track.confidence}>
                {track.confidence}% Match
              </ConfidenceBadge>
              
              <AddButton
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleAddTrack(track)}
              >
                <FaPlus />
              </AddButton>
            </div>
          </RecommendationCard>
        ))}
      </AnimatePresence>
    </RecommendationsContainer>
  );
};

export default PlaylistRecommendations;
