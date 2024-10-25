import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useTheme } from '@mui/material';
import { Canvas } from '@react-three/fiber';
import { VisualizerControls } from './controls/VisualizerControls';
import { Visualizer2D } from './visualizers/Visualizer2D';
import { Visualizer3D } from './visualizers/Visualizer3D';
import MusicPlayerControls from './MusicPlayerControls';
import { useMusicPlayer } from '../../contexts/MusicPlayerContext';

const PlayerContainer = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.9), rgba(20,20,20,0.95));
  color: white;
  z-index: 50;
`;

const VisualizerContainer = styled.div`
  position: relative;
  height: 200px;
  width: 100%;
  overflow: hidden;
`;

const Canvas2D = styled.canvas`
  width: 100%;
  height: 100%;
`;

const EnhancedMusicPlayer: React.FC = () => {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    currentTrack,
    is3D,
    getAnalyserData,
    currentSound,
    toggleView
  } = useMusicPlayer();

  if (!currentTrack) {
    return null;
  }

  return (
    <PlayerContainer
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <VisualizerContainer>
        {is3D ? (
          <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
            <Visualizer3D getAnalyserData={getAnalyserData} />
          </Canvas>
        ) : (
          <Visualizer2D
            ref={canvasRef}
            getAnalyserData={getAnalyserData}
            theme={theme}
          />
        )}
        
        <VisualizerControls
          is3D={is3D}
          onToggleView={toggleView}
          currentSound={currentSound}
        />
      </VisualizerContainer>

      <MusicPlayerControls />
    </PlayerContainer>
  );
};

export default EnhancedMusicPlayer;
