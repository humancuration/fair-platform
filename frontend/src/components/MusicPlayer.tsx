import React, { useEffect, useState, useRef } from 'react';
import { Howl } from 'howler';
import LyricsDisplay from './LyricsDisplay';
import { useError } from '../../fair-platform/frontend/src/contexts/ErrorContext';
import { handleError } from '../../fair-platform/frontend/src/utils/errorHandler';

interface MusicPlayerProps {
  trackId: string;
  trackUrl: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ trackId, trackUrl }) => {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const soundRef = useRef<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const { setError } = useError();

  useEffect(() => {
    const fetchStreamUrl = async () => {
      try {
        const response = await fetch(`https://mirlo.space/api/tracks/${trackId}/stream`);
        const data = await response.json();
        setStreamUrl(data.streamUrl);
      } catch (error) {
        console.error('Error fetching stream URL:', error);
        handleError(error);
        setError('Failed to load the track. Please try again later.');
      }
    };

    fetchStreamUrl();
  }, [trackId, setError]);

  useEffect(() => {
    if (streamUrl) {
      soundRef.current = new Howl({
        src: [streamUrl],
        html5: true,
      });
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, [streamUrl]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const onPlay = () => {
      setIsPlaying(true);
      intervalId = setInterval(() => {
        setElapsedSeconds((prev) => {
          const newElapsed = prev + 1;
          if (newElapsed % 15 === 0) {
            reportPlayback(15);
          }
          return newElapsed;
        });
      }, 1000);
    };

    const onPause = () => {
      setIsPlaying(false);
      clearInterval(intervalId);
    };

    if (soundRef.current) {
      soundRef.current.on('play', onPlay);
      soundRef.current.on('pause', onPause);
      soundRef.current.on('end', onPause);
    }

    return () => {
      clearInterval(intervalId);
      if (soundRef.current) {
        soundRef.current.off('play', onPlay);
        soundRef.current.off('pause', onPause);
        soundRef.current.off('end', onPause);
      }
    };
  }, [soundRef.current]);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.on('play', () => {
        const updateTime = () => {
          setCurrentTime(soundRef.current?.seek() || 0);
          requestAnimationFrame(updateTime);
        };
        updateTime();
      });
    }
  }, [soundRef.current]);

  const togglePlayPause = () => {
    if (soundRef.current) {
      if (isPlaying) {
        soundRef.current.pause();
      } else {
        soundRef.current.play();
      }
    }
  };

  const reportPlayback = async (seconds: number) => {
    try {
      // Replace with actual API call
      await fetch('/api/report-playback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trackId, seconds }),
      });
    } catch (error) {
      console.error('Error reporting playback:', error);
      handleError(error);
    }
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

  return (
    <div>
      <button onClick={togglePlayPause} aria-label={isPlaying ? 'Pause' : 'Play'}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button onClick={downloadForOffline}>Download for Offline</button>
      <p>Elapsed time: {elapsedSeconds} seconds</p>
      <LyricsDisplay trackId={trackId} currentTime={currentTime} />
    </div>
  );
};

export default MusicPlayer;