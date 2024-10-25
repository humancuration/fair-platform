import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { addMediaItem, fetchPlaylists, reorderMediaItems } from '../../store/slices/playlistsSlice';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import Layout from '../../components/Layout';
import MediaItemForm from '../components/MediaItemForm';
import PlaylistItem from '../components/PlaylistItem';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ShareWithGroupModal from '../group/ShareWithGroupModal';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMagic, FaShareAlt, FaPlus, FaPlay } from 'react-icons/fa';
import Confetti from 'react-confetti';
import PlaylistQueue from './PlaylistQueue';
import { usePlaylist } from '../../contexts/PlaylistContext';
import WaveformVisualizer from '../music/visualizers/WaveformVisualizer';

const EnchantedContainer = styled(motion.div)`
  background: linear-gradient(135deg, #6e48aa, #9d50bb);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  color: #fff;
`;

const MagicalTitle = styled(motion.h1)`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
`;

const WhimsicalButton = styled(Button)`
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  border: none;
  border-radius: 25px;
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
`;

const PlaylistDetailsPage: React.FC = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const dispatch = useDispatch();
  const { playlists, loading, error } = useSelector((state: RootState) => state.playlists);
  const [currentPlaylist, setCurrentPlaylist] = useState<any>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAddingMedia, setIsAddingMedia] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { state: playlistState, dispatch: playlistDispatch } = usePlaylist();

  useEffect(() => {
    if (!playlists.length) {
      dispatch(fetchPlaylists());
    } else {
      const pl = playlists.find((pl) => pl.id === playlistId);
      setCurrentPlaylist(pl);
    }
  }, [dispatch, playlists, playlistId]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (playlists.length) {
      const pl = playlists.find((pl) => pl.id === playlistId);
      setCurrentPlaylist(pl);
    }
  }, [playlists, playlistId]);

  const handleAddMedia = async (mediaItem: { type: string; title: string; url: string }) => {
    setIsAddingMedia(true);
    try {
      await dispatch(addMediaItem({ playlistId: currentPlaylist.id, mediaItem })).unwrap();
      toast.success('✨ Magical new item added to your playlist! ✨');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (err: any) {
      toast.error('Oh no! The magic fizzled. Please try again.');
    } finally {
      setIsAddingMedia(false);
    }
  };

  const handleShare = () => {
    toast.info('Preparing to sprinkle some sharing magic!');
    setIsShareModalOpen(true);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(currentPlaylist.mediaItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    dispatch(reorderMediaItems({ playlistId: currentPlaylist.id, mediaItems: items }));
  };

  // Add new function to handle playing the entire playlist
  const handlePlayAll = () => {
    if (currentPlaylist) {
      playlistDispatch({ type: 'SET_PLAYLIST', payload: currentPlaylist });
      playlistDispatch({ type: 'SET_TRACK_INDEX', payload: 0 });
      playlistDispatch({ type: 'TOGGLE_PLAY' });
    }
  };

  // Add function to handle adding to queue
  const handleAddToQueue = (mediaItem: MediaItem) => {
    playlistDispatch({ type: 'ADD_TO_QUEUE', payload: mediaItem });
    toast.success('Added to queue!');
  };

  if (loading || !currentPlaylist) {
    return (
      <Layout>
        <EnchantedContainer
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <LoadingSpinner />
          <p>Summoning your enchanted playlist...</p>
        </EnchantedContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <EnchantedContainer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
        <MagicalTitle
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
        >
          {currentPlaylist.name}
        </MagicalTitle>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {currentPlaylist.description}
        </motion.p>
        
        <MediaItemForm onSubmit={handleAddMedia} isLoading={isAddingMedia} />
        
        <motion.h2
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          Magical Media Items
        </motion.h2>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="playlist">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                <AnimatePresence>
                  {currentPlaylist.mediaItems.map((item: any, index: number) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <PlaylistItem mediaItem={item} index={index} />
                    </motion.li>
                  ))}
                </AnimatePresence>
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        
        <motion.div className="flex gap-4 mb-6">
          <WhimsicalButton onClick={handlePlayAll}>
            <FaPlay /> Play All
          </WhimsicalButton>
          <WhimsicalButton onClick={handleShare}>
            <FaShareAlt /> Share
          </WhimsicalButton>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="playlist">
                {(provided) => (
                  <ul {...provided.droppableProps} ref={provided.innerRef}>
                    <AnimatePresence>
                      {currentPlaylist.mediaItems.map((item: any, index: number) => (
                        <motion.li
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <PlaylistItem mediaItem={item} index={index} />
                        </motion.li>
                      ))}
                    </AnimatePresence>
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          
          <div className="md:col-span-1">
            <PlaylistQueue />
          </div>
        </div>

        {playlistState.currentPlaylist && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-0 left-0 right-0"
          >
            <WaveformVisualizer />
          </motion.div>
        )}

        <ShareWithGroupModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          playlistId={currentPlaylist.id}
        />
      </EnchantedContainer>
    </Layout>
  );
};

export default PlaylistDetailsPage;
