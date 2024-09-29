// BackgroundMusic.jsx

import React, { useState, useEffect } from 'react';

const BackgroundMusic = () => {
  const [audio] = useState(new Audio('/music/background.mp3'));
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => setPlaying(!playing);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
    audio.loop = true;
  }, [playing, audio]);

  return (
    <button onClick={togglePlay} style={{ position: 'fixed', bottom: '20px', left: '20px' }}>
      {playing ? 'Pause Music' : 'Play Music'}
    </button>
  );
};

export default BackgroundMusic;
