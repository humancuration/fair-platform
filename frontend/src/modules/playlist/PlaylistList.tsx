import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPlaylists } from '../../store/slices/playlistsSlice';
import { RootState } from '../../store/store';
import PlaylistCard from './PlaylistCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import { Playlist } from '../../types/playlist';

const PlaylistList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: playlists, loading, error } = useAppSelector((state: RootState) => state.playlists);

  useEffect(() => {
    dispatch(fetchPlaylists());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {playlists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {playlists.map((playlist: Playlist) => (
            <PlaylistCard 
              key={playlist.id} 
              playlist={playlist} 
            />
          ))}
        </div>
      ) : (
        <p>You have no playlists yet.</p>
      )}
    </div>
  );
};

export default PlaylistList;
