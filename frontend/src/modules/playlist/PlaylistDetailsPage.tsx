import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMagic, FaShareAlt, FaPlus, FaPlay } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Components
import Layout from '../../components/Layout';
import MediaItemForm from '../../modules/forms/MediaItemForm';
import SortablePlaylistItem from '../../components/SortablePlaylistItem';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ShareWithGroupModal from '../group/ShareWithGroupModal';
import PlaylistQueue from './PlaylistQueue';
import WaveformVisualizer from '../music/visualizers/WaveformVisualizer';

// Contexts and Types
import { usePlaylist } from '../../contexts/PlaylistContext';
import { useGlobalState } from '../../store/store';
import type { MediaItem, MediaItemType, Playlist } from '../../types/playlist';

const EnchantedContainer = styled(motion.div)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(4),
  boxShadow: theme.shadows[10],
  color: theme.palette.common.white,
}));

const MagicalTitle = styled(motion.h1)(({ theme }) => ({
  fontSize: '3rem',
  textAlign: 'center',
  marginBottom: theme.spacing(2),
  textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
}));

const WhimsicalButton = styled(motion.button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.warning.main})`,
  border: 'none',
  borderRadius: 25,
  padding: '10px 20px',
  fontSize: '1rem',
  color: theme.palette.common.white,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: theme.shadows[3],
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[5],
  },
}));

const PlaylistDetailsPage: React.FC = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const { state, dispatch } = useGlobalState();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { state: playlistState, dispatch: playlistDispatch } = usePlaylist();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch playlist data
  const { data: playlist, isLoading } = useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: async () => {
      const response = await fetch(`/api/playlists/${playlistId}`, {
        headers: {
          Authorization: `Bearer ${state.user.token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch playlist');
      return response.json();
    },
  });

  // Mutation for reordering items
  const reorderMutation = useMutation({
    mutationFn: async ({ playlistId, mediaItems }: { playlistId: string; mediaItems: MediaItem[] }) => {
      const response = await fetch(`/api/playlists/${playlistId}/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.user.token}`,
        },
        body: JSON.stringify({ mediaItems }),
      });
      if (!response.ok) throw new Error('Failed to reorder items');
      return response.json();
    },
    onSuccess: () => {
      toast.success('Playlist order updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update playlist order');
    },
  });

  // Mutation for adding media items
  const addMediaMutation = useMutation({
    mutationFn: async ({ playlistId, mediaItem }: { playlistId: string; mediaItem: Partial<MediaItem> }) => {
      const response = await fetch(`/api/playlists/${playlistId}/media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.user.token}`,
        },
        body: JSON.stringify(mediaItem),
      });
      if (!response.ok) throw new Error('Failed to add media item');
      return response.json();
    },
    onSuccess: () => {
      toast.success('✨ Magical new item added to your playlist! ✨');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add media item');
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && playlist) {
      const oldIndex = playlist.mediaItems.findIndex((item: MediaItem) => item.id === active.id);
      const newIndex = playlist.mediaItems.findIndex((item: MediaItem) => item.id === over.id);

      const newItems = arrayMove(playlist.mediaItems, oldIndex, newIndex) as MediaItem[];
      reorderMutation.mutate({ playlistId: playlist.id, mediaItems: newItems });
    }
  };

  const handleAddMedia = async (mediaItem: { type: string; title: string; url: string }) => {
    if (!playlist) return;
    addMediaMutation.mutate({ 
      playlistId: playlist.id, 
      mediaItem: {
        ...mediaItem,
        type: mediaItem.type as MediaItemType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    });
  };

  const handleShare = () => {
    toast.info('Preparing to sprinkle some sharing magic!');
    setIsShareModalOpen(true);
  };

  const handlePlayAll = () => {
    if (playlist) {
      playlistDispatch({ type: 'SET_PLAYLIST', payload: playlist });
      playlistDispatch({ type: 'SET_TRACK_INDEX', payload: 0 });
      playlistDispatch({ type: 'TOGGLE_PLAY' });
    }
  };

  const handleAddToQueue = (mediaItem: MediaItem) => {
    playlistDispatch({ type: 'ADD_TO_QUEUE', payload: mediaItem });
    toast.success('Added to queue!');
  };

  if (isLoading || !playlist) {
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
        {showConfetti && <div className="confetti-overlay" />}

        <MagicalTitle
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
        >
          {playlist.title}
        </MagicalTitle>

        <MediaItemForm 
          onSubmit={(mediaItem: { type: string; title: string; url: string }) => {
            void handleAddMedia({
              ...mediaItem,
              type: mediaItem.type as MediaItemType
            });
          }}
          isLoading={addMediaMutation.isPending} 
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={playlist.mediaItems.map((item: MediaItem) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <AnimatePresence>
                  {playlist.mediaItems.map((item: MediaItem, index: number) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <SortablePlaylistItem 
                        item={item} 
                        onAddToQueue={handleAddToQueue}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </SortableContext>
            </DndContext>
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
          playlistId={playlist.id}
        />
      </EnchantedContainer>
    </Layout>
  );
};

export default PlaylistDetailsPage;
