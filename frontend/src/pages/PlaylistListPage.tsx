import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlaylists } from '../store/slices/playlistsSlice';
import { RootState } from '../store/store';
import Layout from '../components/Layout';
import PlaylistCard from '../components/PlaylistCard';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

const PlaylistListPage: React.FC = () => {
  const dispatch = useDispatch();
  const { playlists, loading, error } = useSelector((state: RootState) => state.playlists);

  useEffect(() => {
    dispatch(fetchPlaylists());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Your Playlists</h1>
        {loading ? (
          <LoadingSpinner />
        ) : playlists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {playlists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        ) : (
          <p>You have no playlists. Start by creating one!</p>
        )}
      </div>
    </Layout>
  );
};

export default PlaylistListPage;