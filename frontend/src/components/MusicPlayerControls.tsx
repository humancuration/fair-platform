import React from 'react';
import { useMusicPlayer } from '@contexts/MusicPlayerContext';
import MusicPlayer from '@components/MusicPlayer';

const MusicPlayerControls: React.FC = () => {
  const { currentTrackId } = useMusicPlayer();

  if (!currentTrackId) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#f0f0f0', padding: '10px' }}>
      <MusicPlayer trackId={currentTrackId} />
    </div>
  );
};

export default MusicPlayerControls;