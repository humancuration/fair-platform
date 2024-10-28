import React from 'react';
import { motion } from 'framer-motion';
import { useUnifiedMusic } from '~/contexts/UnifiedMusicContext';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, 
         FaVolumeUp, FaVolumeMute, FaCube, FaSquare } from 'react-icons/fa';

const ControlButton = motion.button;

export default function MusicPlayerControls() {
  const {
    isPlaying,
    volume,
    is3D,
    togglePlay,
    setVolume,
    toggleView,
    nextTrack,
    previousTrack,
    currentTrack
  } = useUnifiedMusic();

  if (!currentTrack) return null;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-md p-4 rounded-full">
      <ControlButton
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={previousTrack}
        className="text-white hover:text-primary-400"
      >
        <FaStepBackward size={20} />
      </ControlButton>

      <ControlButton
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white"
      >
        {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
      </ControlButton>

      <ControlButton
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={nextTrack}
        className="text-white hover:text-primary-400"
      >
        <FaStepForward size={20} />
      </ControlButton>

      <div className="flex items-center gap-2">
        <ControlButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setVolume(volume === 0 ? 1 : 0)}
          className="text-white hover:text-primary-400"
        >
          {volume === 0 ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
        </ControlButton>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-24 accent-primary"
        />
      </div>

      <ControlButton
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleView}
        className="text-white hover:text-primary-400"
      >
        {is3D ? <FaCube size={20} /> : <FaSquare size={20} />}
      </ControlButton>
    </div>
  );
}
