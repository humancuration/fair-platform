import React, { createContext, useState, useContext } from 'react';

interface MusicPlayerContextType {
  currentTrackId: string | null;
  setCurrentTrackId: (trackId: string | null) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);

  return (
    <MusicPlayerContext.Provider value={{ currentTrackId, setCurrentTrackId }}>
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