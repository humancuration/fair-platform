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
import ShareWithGroupModal from '../../components/shared/ShareWithGroupModal'; // Import the Share Modal

const PlaylistDetailsPage: React.FC = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const dispatch = useDispatch();
  const { playlists, loading, error } = useSelector((state: RootState) => state.playlists);
  const [currentPlaylist, setCurrentPlaylist] = useState<any>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAddingMedia, setIsAddingMedia] = useState(false);

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
      toast.success('Media item added successfully!');
    } catch (err: any) {
      toast.error(err || 'Failed to add media item.');
    } finally {
      setIsAddingMedia(false);
    }
  };

  const handleShare = () => {
    toast.info('Sharing functionality will be available soon!');
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

  if (loading || !currentPlaylist) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{currentPlaylist.name}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{currentPlaylist.description}</p>
        
        <MediaItemForm onSubmit={handleAddMedia} isLoading={isAddingMedia} />
        
        <h2 className="text-2xl font-semibold mt-6 mb-4">Media Items</h2>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="playlist">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {currentPlaylist.mediaItems.map((item: any, index: number) => (
                  <PlaylistItem key={item.id} mediaItem={item} index={index} />
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        
        <Button onClick={handleShare} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
          Share with Group
        </Button>

        <ShareWithGroupModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          playlistId={currentPlaylist.id}
        />
      </div>
    </Layout>
  );
};

export default PlaylistDetailsPage;