import React from 'react';
import styled from 'styled-components';
import { motion, Reorder } from 'framer-motion';
import { usePlaylist } from '../../contexts/PlaylistContext';
import { FaGripLines, FaTimes } from 'react-icons/fa';

const QueueContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  max-width: 400px;
  width: 100%;
`;

const QueueItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const QueueTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: white;
`;

const RemoveButton = styled(motion.button)`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 5px;
  
  &:hover {
    color: white;
  }
`;

const PlaylistQueue: React.FC = () => {
  const { state, dispatch } = usePlaylist();
  const { queue } = state;

  const handleReorder = (newOrder: typeof queue) => {
    // Implement reordering logic
  };

  const removeFromQueue = (index: number) => {
    dispatch({ type: 'REMOVE_FROM_QUEUE', payload: index });
  };

  return (
    <QueueContainer
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
    >
      <QueueTitle>Up Next</QueueTitle>
      <Reorder.Group axis="y" values={queue} onReorder={handleReorder}>
        {queue.map((item, index) => (
          <Reorder.Item key={item.id} value={item}>
            <QueueItem
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaGripLines />
              <div>
                <div>{item.title}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{item.artist}</div>
              </div>
              <RemoveButton
                whileHover={{ scale: 1.2 }}
                onClick={() => removeFromQueue(index)}
              >
                <FaTimes />
              </RemoveButton>
            </QueueItem>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </QueueContainer>
  );
};

export default PlaylistQueue;
