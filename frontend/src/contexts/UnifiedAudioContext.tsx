import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { Howl, Howler } from 'howler';

interface AudioContextState {
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
  currentSound: Howl | null;
  playAudio: (url: string) => void;
  stopAudio: () => void;
  setVolume: (volume: number) => void;
  getAnalyserData: () => Uint8Array;
}

const UnifiedAudioContext = createContext<AudioContextState | null>(null);

export const UnifiedAudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [currentSound, setCurrentSound] = useState<Howl | null>(null);
  const dataArrayRef = useRef<Uint8Array>(new Uint8Array(0));

  useEffect(() => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyserNode = ctx.createAnalyser();
    analyserNode.fftSize = 256;
    
    setAudioContext(ctx);
    setAnalyser(analyserNode);
    
    return () => {
      ctx.close();
    };
  }, []);

  const playAudio = (url: string) => {
    if (currentSound) {
      currentSound.unload();
    }

    const sound = new Howl({
      src: [url],
      html5: true,
      format: ['mp3', 'wav'],
      onplay: () => {
        if (audioContext && analyser) {
          const source = audioContext.createMediaElementSource(sound._sounds[0]._node);
          source.connect(analyser);
          analyser.connect(audioContext.destination);
        }
      }
    });

    setCurrentSound(sound);
    sound.play();
  };

  const stopAudio = () => {
    currentSound?.stop();
  };

  const setVolume = (volume: number) => {
    if (currentSound) {
      currentSound.volume(volume);
    }
  };

  const getAnalyserData = () => {
    if (analyser) {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);
      dataArrayRef.current = dataArray;
    }
    return dataArrayRef.current;
  };

  return (
    <UnifiedAudioContext.Provider
      value={{
        audioContext,
        analyser,
        currentSound,
        playAudio,
        stopAudio,
        setVolume,
        getAnalyserData,
      }}
    >
      {children}
    </UnifiedAudioContext.Provider>
  );
};

export const useUnifiedAudio = () => {
  const context = useContext(UnifiedAudioContext);
  if (!context) {
    throw new Error('useUnifiedAudio must be used within a UnifiedAudioProvider');
  }
  return context;
};
