import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

interface MediaItem {
  id: string;
  type: 'music' | 'video' | 'social' | 'podcast';
  title: string;
  url: string;
}

interface PlaylistItemProps {
  mediaItem: MediaItem;
  index: number;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({ mediaItem, index }) => {
  const renderMedia = () => {
    switch (mediaItem.type) {
      case 'music':
        return <audio controls src={mediaItem.url} />;
      case 'video':
        return <video controls width="250" src={mediaItem.url}></video>;
      case 'social':
        // Placeholder for future social media integrations
        return (
          <div className="bg-gray-200 p-4 rounded">
            <p>Social media content will be displayed here</p>
            <a href={mediaItem.url} target="_blank" rel="noopener noreferrer">View on platform</a>
          </div>
        );
      case 'podcast':
        return <audio controls src={mediaItem.url} />;
      default:
        return null;
    }
  };

  return (
    <Draggable draggableId={mediaItem.id} index={index}>
      {(provided) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="border p-4 rounded bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <h3 className="text-lg font-semibold mb-2">{mediaItem.title}</h3>
          {renderMedia()}
          <p className="mt-2 text-sm text-gray-600">Type: {mediaItem.type}</p>
        </li>
      )}
    </Draggable>
  );
};

export default PlaylistItem;