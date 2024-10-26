import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

const PlaylistItem: React.FC<PlaylistItemProps> = ({ mediaItem }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: mediaItem.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    zIndex: isDragging ? 999 : undefined,
  };

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
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border p-4 rounded bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <h3 className="text-lg font-semibold mb-2">{mediaItem.title}</h3>
      {renderMedia()}
      <p className="mt-2 text-sm text-gray-600">Type: {mediaItem.type}</p>
    </li>
  );
};

export default PlaylistItem;
