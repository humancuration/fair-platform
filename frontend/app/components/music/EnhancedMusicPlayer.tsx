import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUnifiedMusic } from '~/contexts/UnifiedMusicContext';
import { Visualizer3D } from './visualizers/Visualizer3D';
import { Visualizer2D } from './visualizers/Visualizer2D';
import MusicPlayerControls from './MusicPlayerControls';
import { EducationalOverlay } from './EducationalOverlay';
import { CollaborativeTools } from './CollaborativeTools';
import { useTheme } from '@mui/material';

export function EnhancedMusicPlayer() {
  const theme = useTheme();
  const {
    currentTrack,
    is3D,
    getAnalyserData,
    isCollaborativeMode,
    isPlaying
  } = useUnifiedMusic();

  if (!currentTrack) return null;

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
          <Visualizer3D getAnalyserData={getAnalyserData} />
        ) : (
          <Visualizer2D 
            getAnalyserData={getAnalyserData}
            theme={theme}
          />
        )}

        {currentTrack.educationalContent && (
          <EducationalOverlay 
            content={currentTrack.educationalContent}
            isPlaying={isPlaying}
          />
        )}

        {isCollaborativeMode && (
          <CollaborativeTools 
            trackId={currentTrack.id}
            bpm={currentTrack.bpm}
          />
        )}

        <MusicPlayerControls />
      </div>

      <div className="p-4 flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <motion.img
            src={currentTrack.coverArt}
            alt={currentTrack.title}
            className="w-16 h-16 rounded-lg object-cover"
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <div>
            <h3 className="font-bold">{currentTrack.title}</h3>
            <p className="text-gray-400">{currentTrack.artist}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
