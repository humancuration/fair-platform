import React, { useEffect, useState } from 'react';
import { useGlobalState } from '../../store/store';
import Layout from '../../components/Layout';
import PlaylistCard from './PlaylistCard';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface Playlist {
  id: string;
  title: string;
  description?: string;
  // Add other playlist properties as needed
}

// Add this to your store.ts state interfaces if not already present
interface PlaylistState {
  playlists: Playlist[];
  loading: boolean;
  error: string | null;
}

const PlaylistListPage: React.FC = () => {
  const { state, dispatch } = useGlobalState();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      // Replace this with your actual API call
      const response = await fetch('/api/playlists');
      const data = await response.json();
      
      setPlaylists(data);
      dispatch({ 
        type: 'SET_PLAYLISTS',
        payload: data 
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch playlists';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Playlists</h1>
          <button 
            onClick={() => fetchPlaylists()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : playlists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {playlists.map((playlist: Playlist) => (
              <PlaylistCard 
                key={playlist.id} 
                playlist={playlist}
                onDelete={async (id: string) => {
                  try {
                    // Replace with your actual delete API call
                    await fetch(`/api/playlists/${id}`, { method: 'DELETE' });
                    setPlaylists(playlists.filter(p => p.id !== id));
                    toast.success('Playlist deleted successfully');
                  } catch (err) {
                    toast.error('Failed to delete playlist');
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">You have no playlists yet.</p>
            <button 
              onClick={() => {/* Add navigation to create playlist page */}}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
            >
              Create Your First Playlist
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PlaylistListPage;
