import { useEffect, useState } from 'react';
import { Howl } from 'howler';
import { useAudio } from '~/contexts/audio';
import type { Track } from '~/services/audio.server';

interface BackgroundMusicProps {
  tracks: Track[];
  currentMood?: string;
  crossfadeDuration?: number;
  onTrackChange?: (track: Track) => void;
}

export default function BackgroundMusic({
  tracks,
  currentMood = 'calm',
  crossfadeDuration = 2000,
  onTrackChange
}: BackgroundMusicProps) {
  const [nextTrack, setNextTrack] = useState<Track | null>(null);
  const [currentSound, setCurrentSound] = useState<Howl | null>(null);
  const [nextSound, setNextSound] = useState<Howl | null>(null);

  const { 
    masterVolume, 
    backgroundMusicVolume, 
    isMuted,
    currentTrack,
    setCurrentTrack
  } = useAudio();

  useEffect(() => {
    const moodTracks = tracks.filter(track => track.mood === currentMood);
    if (moodTracks.length > 0) {
      const randomTrack = moodTracks[Math.floor(Math.random() * moodTracks.length)];
      if (!currentTrack || currentTrack.id !== randomTrack.id) {
        setNextTrack(randomTrack);
      }
    }
  }, [currentMood, tracks, currentTrack]);

  useEffect(() => {
    if (nextTrack && (!currentTrack || nextTrack.id !== currentTrack.id)) {
      const newSound = new Howl({
        src: [nextTrack.url],
        loop: nextTrack.loop,
        volume: 0,
        onload: () => crossfade()
      });

      setNextSound(newSound);
    }
  }, [nextTrack]);

  const crossfade = () => {
    if (!nextTrack) return;

    if (currentSound && nextSound) {
      currentSound.fade(currentSound.volume(), 0, crossfadeDuration);
      nextSound.fade(
        0,
        isMuted ? 0 : nextTrack.volume || backgroundMusicVolume * masterVolume,
        crossfadeDuration
      );
      nextSound.play();

      setTimeout(() => {
        currentSound.stop();
        currentSound.unload();
        setCurrentSound(nextSound);
        setCurrentTrack(nextTrack);
        setNextSound(null);
        setNextTrack(null);
        onTrackChange?.(nextTrack);
      }, crossfadeDuration);
    } else if (nextSound) {
      nextSound.fade(
        0,
        isMuted ? 0 : nextTrack.volume || backgroundMusicVolume * masterVolume,
        crossfadeDuration
      );
      nextSound.play();
      setCurrentSound(nextSound);
      setCurrentTrack(nextTrack);
      setNextSound(null);
      setNextTrack(null);
      onTrackChange?.(nextTrack);
    }
  };

  useEffect(() => {
    if (currentSound) {
      currentSound.volume(isMuted ? 0 : backgroundMusicVolume * masterVolume);
    }
  }, [masterVolume, backgroundMusicVolume, isMuted]);

  return null;
}
