import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPlaylist } from '../../store/slices/playlistsSlice';
import { RootState } from '../../store/store';
import Layout from '../../components/Layout';
import PlaylistForm from '../components/PlaylistForm';
import { toast } from 'react-toastify';

const PlaylistCreationPage: React.FC = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.playlists);

  const handleCreate = async (data: { name: string; description: string; groupId?: string }) => {
    try {
      await dispatch(createPlaylist(data)).unwrap();
      toast.success('Playlist created successfully!');
    } catch (err: any) {
      toast.error(err || 'Failed to create playlist.');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Create a New Playlist</h1>
        <PlaylistForm onSubmit={handleCreate} loading={loading} />
        {error && <p className="text-red-500 mt-4">Error: {error}</p>}
      </div>
    </Layout>
  );
};

export default PlaylistCreationPage;