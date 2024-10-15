import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Howl } from 'howler';
import styled from 'styled-components';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import LyricsDisplay from './LyricsDisplay';
import { useError } from '../contexts/ErrorContext';
import { handleError } from '../utils/errorHandler';

interface MusicPlayerProps {
  trackId: string;
  trackUrl: string;
  onTrackEnd?: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ trackId, trackUrl, onTrackEnd }) => {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const { setError } = useError();

  const soundRef = useRef<Howl | null>(null);

  const fetchStreamUrl = useCallback(async () => {
    try {
      const response = await fetch(`https://mirlo.space/api/tracks/${trackId}/stream`);
      const data = await response.json();
      setStreamUrl(data.streamUrl);
    } catch (error) {
      console.error('Error fetching stream URL:', error);
      handleError(error);
      setError('Failed to load the track. Please try again later.');
    }
  }, [trackId, setError]);

  useEffect(() => {
    fetchStreamUrl();
  }, [fetchStreamUrl]);

  useEffect(() => {
    if (streamUrl) {
      soundRef.current = new Howl({
        src: [streamUrl],
        html5: true,
        volume: volume,
        onload: () => {
          setDuration(soundRef.current?.duration() || 0);
          setLoading(false);
        },
        onend: () => {
          setIsPlaying(false);
          if (onTrackEnd) onTrackEnd();
        },
        onplay: () => setIsPlaying(true),
        onpause: () => setIsPlaying(false),
        onstop: () => setIsPlaying(false),
      });
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, [streamUrl, volume, onTrackEnd]);

  useEffect(() => {
    const updateTime = () => {
      if (soundRef.current) {
        setCurrentTime(soundRef.current.seek());
      }
      if (isPlaying) {
        requestAnimationFrame(updateTime);
      }
    };
    if (isPlaying) {
      updateTime();
    }
  }, [isPlaying]);

  const togglePlayPause = useCallback(() => {
    if (soundRef.current) {
      if (isPlaying) {
        soundRef.current.pause();
      } else {
        soundRef.current.play();
      }
    }
  }, [isPlaying]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (soundRef.current) {
      soundRef.current.volume(newVolume);
    }
    if (muted && newVolume > 0) {
      setMuted(false);
    }
  }, [muted]);

  const toggleMute = useCallback(() => {
    if (soundRef.current) {
      if (muted) {
        soundRef.current.volume(volume);
      } else {
        soundRef.current.volume(0);
      }
      setMuted(!muted);
    }
  }, [muted, volume]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    if (soundRef.current) {
      soundRef.current.seek(seekTime);
      setCurrentTime(seekTime);
    }
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const downloadForOffline = async () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        action: 'CACHE_NEW_TRACK',
        trackUrl,
      });
      alert('Track downloaded for offline listening.');
    }
  };

  if (loading) {
    return <LoadingMessage>Loading...</LoadingMessage>;
  }

  return (
    <PlayerContainer>
      <Controls>
        <ControlButton onClick={togglePlayPause}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </ControlButton>
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
      </Controls>
      <ProgressContainer>
        <TimeDisplay>{formatTime(currentTime)}</TimeDisplay>
        <ProgressBar
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
        />
        <TimeDisplay>{formatTime(duration)}</TimeDisplay>
      </ProgressContainer>
      <DownloadButton onClick={downloadForOffline}>Download for Offline</DownloadButton>
      <LyricsDisplay trackId={trackId} currentTime={currentTime} />
    </PlayerContainer>
  );
};

const PlayerContainer = styled.div`
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const ControlButton = styled.button`
  background-color: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  margin-right: 15px;
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
`;

const MuteButton = styled.button`
  background-color: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  margin-right: 5px;
`;

const VolumeSlider = styled.input`
  width: 80px;
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const TimeDisplay = styled.span`
  font-size: 14px;
  margin: 0 10px;
`;

const ProgressBar = styled.input`
  flex-grow: 1;
`;

const DownloadButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background-color: #45a049;
  }
`;

const LoadingMessage = styled.div`
  font-size: 18px;
  color: #666;
  text-align: center;
  padding: 20px;
`;

export default MusicPlayer;