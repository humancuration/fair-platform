import React from 'react';
import { IconButton, Tooltip, Paper } from '@mui/material';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { Howl } from 'howler';

const ControlsContainer = styled(Paper)`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  display: flex;
  gap: 8px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  z-index: 10;
`;

// Instead of using motion(IconButton), we'll create a motion component wrapper
const MotionWrapper = styled(motion.div)`
  display: inline-block;
`;

const StyledIconButton = styled(IconButton)`
  color: white;
  &:hover {
    color: ${({ theme }) => theme.palette.primary.main};
  }
`;

interface VisualizerControlsProps {
  is3D: boolean;
  onToggleView: () => void;
  currentSound?: Howl | null;
}

export const VisualizerControls: React.FC<VisualizerControlsProps> = ({
  is3D,
  onToggleView,
  currentSound,
}) => {
  const [isMuted, setIsMuted] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handlePlayPause = () => {
    if (!currentSound) return;
    
    if (isPlaying) {
      currentSound.pause();
    } else {
      currentSound.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMute = () => {
    if (!currentSound) return;
    
    currentSound.mute(!isMuted);
    setIsMuted(!isMuted);
  };

  return (
    <ControlsContainer elevation={3}>
      <Tooltip title={`Switch to ${is3D ? '2D' : '3D'} View`}>
        <MotionWrapper
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <StyledIconButton onClick={onToggleView}>
            {is3D ? <ThreeDRotationIcon /> : <ViewInArIcon />}
          </StyledIconButton>
        </MotionWrapper>
      </Tooltip>

      <Tooltip title={isPlaying ? 'Pause' : 'Play'}>
        <MotionWrapper
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <StyledIconButton onClick={handlePlayPause}>
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </StyledIconButton>
        </MotionWrapper>
      </Tooltip>

      <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
        <MotionWrapper
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <StyledIconButton onClick={handleMute}>
            {isMuted ? <VolumeMuteIcon /> : <VolumeUpIcon />}
          </StyledIconButton>
        </MotionWrapper>
      </Tooltip>
    </ControlsContainer>
  );
};
