import { createContext, useContext, useState, useEffect } from 'react';
import { Howl, Howler } from 'howler';

interface MusicContextType {
  currentTrack: Track | null;
  playlist: Track[];
  isPlaying: boolean;
  volume: number;
  is3D: boolean;
  analyserData: Uint8Array;
  currentSound: Howl | null;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleView: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  addToPlaylist: (track: Track) => void;
  getAnalyserData: () => Uint8Array;
  setCollaborativeMode: (enabled: boolean) => void;
  isCollaborativeMode: boolean;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverArt: string;
  duration: number;
  visualizerType: 'bars' | 'circles' | 'waves';
  genre: string;
  bpm: number;
  educationalContent?: {
    musicTheory?: string[];
    culturalContext?: string[];
    historicalInfo?: string[];
  };
}

const MusicContext = createContext<MusicContextType | null>(null);

export const UnifiedMusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [is3D, setIs3D] = useState(true);
  const [analyserData, setAnalyserData] = useState<Uint8Array>(new Uint8Array());
  const [currentSound, setCurrentSound] = useState<Howl | null>(null);
  const [isCollaborativeMode, setCollaborativeMode] = useState(false);

  // Initialize Web Audio API analyzer
  useEffect(() => {
    const audioContext = Howler.ctx;
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    Howler.masterGain.connect(analyser);

    const updateAnalyser = () => {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      setAnalyserData(dataArray);
      requestAnimationFrame(updateAnalyser);
    };

    updateAnalyser();
  }, []);

  // Other implementation details...

  return (
    <MusicContext.Provider value={{
      currentTrack,
      playlist,
      isPlaying,
      volume,
      is3D,
      analyserData,
      currentSound,
      togglePlay: () => {/* implementation */},
      setVolume: (v) => {/* implementation */},
      toggleView: () => setIs3D(!is3D),
      nextTrack: () => {/* implementation */},
      previousTrack: () => {/* implementation */},
      addToPlaylist: (track) => {/* implementation */},
      getAnalyserData: () => analyserData,
      setCollaborativeMode,
      isCollaborativeMode
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useUnifiedMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useUnifiedMusic must be used within a UnifiedMusicProvider');
  }
  return context;
};
