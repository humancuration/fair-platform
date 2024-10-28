import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { styled } from '@mui/material/styles';
import { Paper, IconButton, Typography } from '@mui/material';
import { FaGripVertical, FaPlay, FaPlus } from 'react-icons/fa';
import { MediaItem } from '../types/playlist';

interface SortablePlaylistItemProps {
  item: MediaItem;
  onAddToQueue: (item: MediaItem) => void;
}

const ItemContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const DragHandle = styled(FaGripVertical)({
  cursor: 'grab',
  marginRight: '12px',
  opacity: 0.5,
  '&:hover': {
    opacity: 1,
  },
});

const SortablePlaylistItem: React.FC<SortablePlaylistItemProps> = ({ item, onAddToQueue }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <ItemContainer ref={setNodeRef} style={style}>
      <div {...attributes} {...listeners}>
        <DragHandle />
      </div>
      <Typography variant="body1" sx={{ flex: 1 }}>
        {item.title}
      </Typography>
      <IconButton onClick={() => onAddToQueue(item)} size="small" color="primary">
        <FaPlus />
      </IconButton>
    </ItemContainer>
  );
};

export default SortablePlaylistItem;
