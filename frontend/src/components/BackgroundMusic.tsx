import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import styled from 'styled-components';

const BackgroundMusic: React.FC = () => {
  const [audio] = useState(new Audio('/music/background.mp3'));
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fadeInterval = useRef<number | null>(null);

  const togglePlay = useCallback(() => {
    if (playing) {
      fadeOut();
    } else {
      fadeIn();
    }
    setPlaying(!playing);
  }, [playing]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audio.volume = newVolume;
    if (muted && newVolume > 0) {
      setMuted(false);
    }
  }, [audio, muted]);

  const toggleMute = useCallback(() => {
    if (muted) {
      audio.volume = volume;
    } else {
      audio.volume = 0;
    }
    setMuted(!muted);
  }, [audio, muted, volume]);

  const fadeIn = useCallback(() => {
    audio.volume = 0;
    audio.play();
    let vol = 0;
    fadeInterval.current = window.setInterval(() => {
      if (vol < volume) {
        vol += 0.05;
        audio.volume = Math.min(vol, volume);
      } else {
        if (fadeInterval.current) clearInterval(fadeInterval.current);
      }
    }, 100);
  }, [audio, volume]);

  const fadeOut = useCallback(() => {
    let vol = audio.volume;
    fadeInterval.current = window.setInterval(() => {
      if (vol > 0) {
        vol -= 0.05;
        audio.volume = Math.max(vol, 0);
      } else {
        audio.pause();
        if (fadeInterval.current) clearInterval(fadeInterval.current);
      }
    }, 100);
  }, [audio]);

  useEffect(() => {
    audio.loop = true;
    audio.volume = volume;

    const handleCanPlay = () => setLoading(false);
    const handleError = () => {
      setError('Failed to load audio file');
      setLoading(false);
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      if (fadeInterval.current) clearInterval(fadeInterval.current);
    };
  }, [audio, volume]);

  if (error) {
    return <ErrorMessage>Error: {error}</ErrorMessage>;
  }

  return (
    <PlayerContainer>
      <PlayButton onClick={togglePlay} disabled={loading}>
        {loading ? '...' : playing ? <FaPause /> : <FaPlay />}
      </PlayButton>
      <VolumeControl>
        <MuteButton onClick={toggleMute}>
          {muted ? <FaVolumeMute /> : <FaVolumeUp />}
        </MuteButton>
        <VolumeSlider
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={muted ? 0 : volume}
          onChange={handleVolumeChange}
        />
      </VolumeControl>
    </PlayerContainer>
  );
};

const PlayerContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 20px;
`;

const PlayButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: white;
  &:disabled {
    cursor: wait;
    opacity: 0.5;
  }
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const MuteButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: white;
`;

const VolumeSlider = styled.input`
  width: 80px;
  -webkit-appearance: none;
  background: transparent;
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    margin-top: -6px;
  }
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 4px;
    cursor: pointer;
    background: #4a4a4a;
    border-radius: 2px;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-weight: bold;
`;

export default BackgroundMusic;
