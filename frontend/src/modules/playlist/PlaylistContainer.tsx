import React from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import PlaylistItem from './PlaylistItem';
import { MediaItem } from '../types/MediaItem'; 

interface PlaylistContainerProps {
  items: MediaItem[];
  onReorder: (items: MediaItem[]) => void;
}

const PlaylistContainer: React.FC<PlaylistContainerProps> = ({ items, onReorder }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      
      onReorder(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={items.map(item => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul>
          {items.map((item, index) => (
            <PlaylistItem 
              key={item.id}
              mediaItem={item}
              index={index}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};

export default PlaylistContainer;
