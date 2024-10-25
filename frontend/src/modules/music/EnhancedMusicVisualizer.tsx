import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import { useTheme } from '@mui/material';
import { Visualizer3D } from './visualizers/Visualizer3D';
import { Visualizer2D } from './visualizers/Visualizer2D';
import { VisualizerControls } from './controls/VisualizerControls';
import { useUnifiedAudioContext } from '@contexts/UnifiedAudioContext';

const VisualizerContainer = styled(motion.div)`
  width: 100%;
  height: 300px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: ${({ theme }) => theme.palette.background.paper};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CanvasWrapper = styled.div<{ is3D: boolean }>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: ${({ is3D }) => (is3D ? 1 : 0)};
  transition: opacity 0.5s ease;
`;

const Canvas2D = styled.canvas`
  width: 100%;
  height: 100%;
`;

interface EnhancedMusicVisualizerProps {
  audioUrl?: string;
}

export const EnhancedMusicVisualizer: React.FC<EnhancedMusicVisualizerProps> = ({ audioUrl }) => {
  const theme = useTheme();
  const [is3D, setIs3D] = useState(true);
  const [analyserData, setAnalyserData] = useState<Uint8Array>(new Uint8Array(0));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { audioContext, analyser, currentSound } = useUnifiedAudioContext();
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!analyser || !audioContext) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const animate = () => {
      analyser.getByteFrequencyData(dataArray);
      setAnalyserData(new Uint8Array(dataArray));
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyser, audioContext]);

  const getAnalyserData = () => analyserData;

  return (
    <VisualizerContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <AnimatePresence mode="wait">
        {is3D ? (
          <CanvasWrapper is3D={is3D} key="3d">
            <Canvas
              camera={{ position: [0, 2, 5], fov: 75 }}
              style={{ background: theme.palette.background.default }}
            >
              <Visualizer3D getAnalyserData={getAnalyserData} />
            </Canvas>
          </CanvasWrapper>
        ) : (
          <CanvasWrapper is3D={!is3D} key="2d">
            <Visualizer2D
              ref={canvasRef}
              getAnalyserData={getAnalyserData}
              theme={theme}
            />
          </CanvasWrapper>
        )}
      </AnimatePresence>

      <VisualizerControls
        is3D={is3D}
        onToggleView={() => setIs3D(!is3D)}
        currentSound={currentSound}
      />
    </VisualizerContainer>
  );
};
