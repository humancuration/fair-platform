import React, { useEffect, useState } from 'react';

interface Lyric {
  time: number;
  text: string;
}

interface LyricsDisplayProps {
  trackId: string;
  currentTime: number;
}

const LyricsDisplay: React.FC<LyricsDisplayProps> = ({ trackId, currentTime }) => {
  const [lyrics, setLyrics] = useState<Lyric[]>([]);
  const [currentLine, setCurrentLine] = useState('');

  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        const response = await fetch(`/api/lyrics/${trackId}`);
        const data = await response.json();
        setLyrics(data);
      } catch (error) {
        console.error('Failed to fetch lyrics:', error);
      }
    };
    fetchLyrics();
  }, [trackId]);

  useEffect(() => {
    const line = lyrics.find((line) => currentTime >= line.time);
    if (line) {
      setCurrentLine(line.text);
    }
  }, [currentTime, lyrics]);

  return (
    <div className="lyrics-display" aria-live="polite">
      {currentLine}
    </div>
  );
};

export default LyricsDisplay;