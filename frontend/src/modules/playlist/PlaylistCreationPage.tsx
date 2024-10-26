import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import PlaylistForm from '../forms/PlaylistForm';
import { useGlobalState } from '../../store/store';
import type { Playlist, CreatePlaylistData } from '../../types/playlist';

const PlaylistCreationPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGlobalState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPlaylistMutation = useMutation({
    mutationFn: async (data: CreatePlaylistData) => {
      const response = await fetch('/api/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.user.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create playlist');
      }

      return response.json() as Promise<Playlist>;
    },
    onSuccess: (newPlaylist) => {
      // Update global state
      dispatch({
        type: 'SET_PLAYLISTS',
        payload: [...(state.playlists.items || []), newPlaylist],
      });
      
      toast.success('Playlist created successfully!');
      navigate('/playlists');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create playlist');
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleCreate = async (data: CreatePlaylistData) => {
    setIsSubmitting(true);
    createPlaylistMutation.mutate(data);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create a New Playlist</h1>
          
          <PlaylistForm 
            onSubmit={handleCreate}
            loading={isSubmitting}
            error={createPlaylistMutation.error?.message}
          />

          {createPlaylistMutation.error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">
                {createPlaylistMutation.error.message}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PlaylistCreationPage;
