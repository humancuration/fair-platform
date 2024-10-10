import React from 'react';
import { Link } from 'react-router-dom';

interface MediaItem {
  id: string;
  type: 'music' | 'video' | 'social' | 'podcast';
  title: string;
  url: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  mediaItems: MediaItem[];
  ownerId: string;
  groupId?: string;
  createdAt: string;
}

interface PlaylistCardProps {
  playlist: Playlist;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-2">{playlist.name}</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{playlist.description}</p>
      <p className="text-sm text-gray-500">
        Media Items: {playlist.mediaItems.length}
      </p>
      <div className="flex items-center space-x-2">
        {playlist.groupId && (
          <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded">
            Group Playlist
          </span>
        )}
      </div>
      <Link to={`/playlists/${playlist.id}`} className="text-blue-500 mt-2 inline-block">
        View Playlist
      </Link>
    </div>
  );
};

export default PlaylistCard;