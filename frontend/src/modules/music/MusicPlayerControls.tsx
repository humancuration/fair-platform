import React, { useCallback } from 'react';
import { useMusicPlayer } from '@contexts/MusicPlayerContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import type { Engine } from 'tsparticles-engine';

const FantasticalContainer = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to right, #8e2de2, #4a00e0);
  padding: 20px;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.3);
`;

const GlowingText = styled.h2`
  color: #fff;
  text-align: center;
  font-size: 24px;
  text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #0ff, 0 0 70px #0ff, 0 0 80px #0ff, 0 0 100px #0ff, 0 0 150px #0ff;
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const VolumeSlider = styled.input`
  -webkit-appearance: none;
  width: 100px;
  height: 5px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  transition: opacity .2s;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
  }
`;

const TrackInfo = styled.div`
  text-align: center;
  color: white;
  margin-bottom: 20px;
`;

const MusicPlayerControls: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    volume, 
    setVolume, 
    nextTrack, 
    previousTrack 
  } = useMusicPlayer();

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  if (!currentTrack) {
    return null;
  }

  return (
    <FantasticalContainer
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: 'transparent' } },
          fpsLimit: 60,
          particles: {
            color: { value: '#ffffff' },
            links: { enable: false },
            move: {
              direction: 'top',
              enable: true,
              outModes: 'out',
              random: false,
              speed: 2,
              straight: false,
            },
            number: { density: { enable: true, area: 800 }, value: 80 },
            opacity: { value: 0.5 },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 5 } },
          },
        }}
      />
      <GlowingText>Magical Music Experience</GlowingText>
      <TrackInfo>
        <h3>{currentTrack.title}</h3>
        <p>{currentTrack.artist}</p>
      </TrackInfo>
      <Controls>
        <ControlButton onClick={previousTrack}>
          <FaStepBackward />
        </ControlButton>
        <ControlButton onClick={togglePlay}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </ControlButton>
        <ControlButton onClick={nextTrack}>
          <FaStepForward />
        </ControlButton>
        <VolumeControl>
          {volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
          <VolumeSlider
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
        </VolumeControl>
      </Controls>
    </FantasticalContainer>
  );
};

export default MusicPlayerControls;
