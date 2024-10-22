import React, { createContext, useState, useContext, useCallback } from 'react';
import { Howl } from 'howler';

interface Track {
  id: string;
  url: string;
  title: string;
  artist: string;
  coverArt: string;
}

interface MusicPlayerContextType {
  currentTrack: Track | null;
  setCurrentTrack: (track: Track | null) => void;
  isPlaying: boolean;
  togglePlay: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  playlist: Track[];
  addToPlaylist: (track: Track) => void;
  removeFromPlaylist: (trackId: string) => void;
  nextTrack: () => void;
  previousTrack: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [sound, setSound] = useState<Howl | null>(null);

  const togglePlay = useCallback(() => {
    if (sound) {
      if (isPlaying) {
        sound.pause();
      } else {
        sound.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [sound, isPlaying]);

  const addToPlaylist = useCallback((track: Track) => {
    setPlaylist(prev => [...prev, track]);
  }, []);

  const removeFromPlaylist = useCallback((trackId: string) => {
    setPlaylist(prev => prev.filter(track => track.id !== trackId));
  }, []);

  const nextTrack = useCallback(() => {
    if (currentTrack && playlist.length > 0) {
      const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
      const nextIndex = (currentIndex + 1) % playlist.length;
      setCurrentTrack(playlist[nextIndex]);
    }
  }, [currentTrack, playlist]);

  const previousTrack = useCallback(() => {
    if (currentTrack && playlist.length > 0) {
      const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
      const previousIndex = (currentIndex - 1 + playlist.length) % playlist.length;
      setCurrentTrack(playlist[previousIndex]);
    }
  }, [currentTrack, playlist]);

  React.useEffect(() => {
    if (currentTrack) {
      if (sound) {
        sound.unload();
      }
      const newSound = new Howl({
        src: [currentTrack.url],
        html5: true,
        volume: volume,
        onplay: () => setIsPlaying(true),
        onpause: () => setIsPlaying(false),
        onend: () => nextTrack(),
      });
      setSound(newSound);
      newSound.play();
    }
  }, [currentTrack, volume, nextTrack]);

  return (
    <MusicPlayerContext.Provider 
      value={{ 
        currentTrack, 
        setCurrentTrack, 
        isPlaying, 
        togglePlay, 
        volume, 
        setVolume,
        playlist,
        addToPlaylist,
        removeFromPlaylist,
        nextTrack,
        previousTrack
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};
