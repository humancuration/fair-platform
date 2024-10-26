import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { useMusic } from '~/contexts/music';
import { Visualizer2D } from './visualizers/Visualizer2D';
import { Visualizer3D } from './visualizers/Visualizer3D';
import { PlayerControls } from './PlayerControls';

export default function EnhancedMusicPlayer() {
  const {
    currentTrack,
    is3D,
    getAnalyserData,
    currentSound,
    toggleView
  } = useMusic();

  if (!currentTrack) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      transition={{ type: 'spring', damping: 20 }}
      className="fixed bottom-0 left-0 right-0 bg-black/90 text-white"
    >
      <div className="relative h-[200px]">
        {is3D ? (
          <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
            <Visualizer3D getAnalyserData={getAnalyserData} />
          </Canvas>
        ) : (
          <Visualizer2D
            getAnalyserData={getAnalyserData}
          />
        )}
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <PlayerControls
            is3D={is3D}
            onToggleView={toggleView}
            currentSound={currentSound}
          />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.img
              src={currentTrack.coverArt}
              alt={currentTrack.title}
              className="w-16 h-16 rounded object-cover"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <div>
              <h3 className="font-bold">{currentTrack.title}</h3>
              <p className="text-gray-400">{currentTrack.artist}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
