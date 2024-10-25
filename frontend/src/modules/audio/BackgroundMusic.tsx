import React, { useEffect, useState } from 'react';
import { useAudio } from '../../contexts/AudioContext';
import { Howl } from 'howler';

interface Track {
  id: string;
  url: string;
  title: string;
  mood: 'calm' | 'intense' | 'mysterious' | 'upbeat';
  loop: boolean;
  volume?: number;
  fadeIn?: number;
  fadeOut?: number;
}

interface BackgroundMusicProps {
  tracks: Track[];
  currentMood?: string;
  crossfadeDuration?: number;
  onTrackChange?: (track: Track) => void;
}

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({
  tracks,
  currentMood = 'calm',
  crossfadeDuration = 2000,
  onTrackChange
}) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [nextTrack, setNextTrack] = useState<Track | null>(null);
  const [currentSound, setCurrentSound] = useState<Howl | null>(null);
  const [nextSound, setNextSound] = useState<Howl | null>(null);

  const { 
    masterVolume, 
    backgroundMusicVolume, 
    isMuted 
  } = useAudio();

  useEffect(() => {
    // Find appropriate track for current mood
    const moodTracks = tracks.filter(track => track.mood === currentMood);
    if (moodTracks.length > 0) {
      const randomTrack = moodTracks[Math.floor(Math.random() * moodTracks.length)];
      
      if (!currentTrack || currentTrack.id !== randomTrack.id) {
        setNextTrack(randomTrack);
      }
    }
  }, [currentMood, tracks]);

  useEffect(() => {
    if (nextTrack && (!currentTrack || nextTrack.id !== currentTrack.id)) {
      const newSound = new Howl({
        src: [nextTrack.url],
        loop: nextTrack.loop,
        volume: 0,
        onload: () => {
          crossfade();
        }
      });

      setNextSound(newSound);
    }
  }, [nextTrack]);

  const crossfade = () => {
    if (currentSound && nextSound) {
      // Fade out current track
      currentSound.fade(
        currentSound.volume(),
        0,
        crossfadeDuration
      );

      // Fade in next track
      nextSound.fade(
        0,
        isMuted ? 0 : nextTrack?.volume || backgroundMusicVolume * masterVolume,
        crossfadeDuration
      );
      nextSound.play();

      // Clean up after crossfade
      setTimeout(() => {
        currentSound.stop();
        currentSound.unload();
        setCurrentSound(nextSound);
        setCurrentTrack(nextTrack);
        setNextSound(null);
        setNextTrack(null);
        onTrackChange?.(nextTrack!);
      }, crossfadeDuration);
    } else if (nextSound) {
      // No current sound, just start the next track
      nextSound.fade(
        0,
        isMuted ? 0 : nextTrack?.volume || backgroundMusicVolume * masterVolume,
        crossfadeDuration
      );
      nextSound.play();
      setCurrentSound(nextSound);
      setCurrentTrack(nextTrack);
      setNextSound(null);
      setNextTrack(null);
      onTrackChange?.(nextTrack!);
    }
  };

  // Update volume when audio context changes
  useEffect(() => {
    if (currentSound) {
      currentSound.volume(isMuted ? 0 : backgroundMusicVolume * masterVolume);
    }
  }, [masterVolume, backgroundMusicVolume, isMuted]);

  return null; // This component doesn't render anything
};

export default BackgroundMusic;
