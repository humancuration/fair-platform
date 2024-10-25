import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../../contexts/AudioContext';
import { Howl, Howler } from 'howler';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRandom, FaRedoAlt } from 'react-icons/fa';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

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
}

interface MusicPlayerProps {
  playlist: Track[];
  autoPlay?: boolean;
  showVisualizer?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  playlist,
  autoPlay = false,
  showVisualizer = true
}) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'none' | 'one' | 'all'>('none');
  const [audioData, setAudioData] = useState<number[]>([]);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  const { 
    masterVolume, 
    backgroundMusicVolume,
    isMuted 
  } = useAudio();

  const currentTrack = playlist[currentTrackIndex];
  const [sound, setSound] = useState<Howl | null>(null);

  useEffect(() => {
    if (currentTrack) {
      const newSound = new Howl({
        src: [currentTrack.url],
        html5: true,
        volume: isMuted ? 0 : masterVolume * backgroundMusicVolume,
        onend: handleTrackEnd,
        onload: () => {
          // Set up Web Audio API analyzer
          const audioContext = Howler.ctx;
          const analyserNode = audioContext.createAnalyser();
          analyserNode.fftSize = 256;
          Howler.masterGain.connect(analyserNode);
          setAnalyser(analyserNode);
        }
      });
      setSound(newSound);

      return () => {
        newSound.unload();
      };
    }
  }, [currentTrack, masterVolume, backgroundMusicVolume, isMuted]);

  const handleTrackEnd = () => {
    if (repeat === 'one') {
      sound?.play();
    } else if (repeat === 'all' || currentTrackIndex < playlist.length - 1) {
      playNext();
    }
  };

  const togglePlay = () => {
    if (sound) {
      if (isPlaying) {
        sound.pause();
      } else {
        sound.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playNext = () => {
    if (shuffle) {
      const nextIndex = Math.floor(Math.random() * playlist.length);
      setCurrentTrackIndex(nextIndex);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    }
  };

  const playPrevious = () => {
    if (shuffle) {
      const prevIndex = Math.floor(Math.random() * playlist.length);
      setCurrentTrackIndex(prevIndex);
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    }
  };

  // Visualizer component using Three.js
  const Visualizer = () => {
    const { scene } = useThree();
    const bars = React.useRef<THREE.Mesh[]>([]);

    useFrame(() => {
      if (analyser && isPlaying) {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        
        bars.current.forEach((bar, i) => {
          const value = dataArray[i] / 255;
          bar.scale.y = value * 3 + 0.1;
        });
      }
    });

    useEffect(() => {
      // Create visualizer bars
      const geometry = new THREE.BoxGeometry(0.1, 1, 0.1);
      const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

      for (let i = 0; i < 32; i++) {
        const bar = new THREE.Mesh(geometry, material);
        bar.position.x = i * 0.2 - 3;
        scene.add(bar);
        bars.current.push(bar);
      }

      return () => {
        bars.current.forEach(bar => scene.remove(bar));
      };
    }, [scene]);

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-90 text-white p-4"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.img
            src={currentTrack.coverArt}
            alt={currentTrack.title}
            className="w-16 h-16 rounded"
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <div>
            <h3 className="font-bold">{currentTrack.title}</h3>
            <p className="text-gray-400">{currentTrack.artist}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setShuffle(!shuffle)}>
            <FaRandom className={shuffle ? 'text-green-500' : 'text-white'} />
          </button>
          <button onClick={playPrevious}>
            <FaStepBackward />
          </button>
          <button
            onClick={togglePlay}
            className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center"
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={playNext}>
            <FaStepForward />
          </button>
          <button onClick={() => setRepeat(repeat === 'none' ? 'one' : repeat === 'one' ? 'all' : 'none')}>
            <FaRedoAlt className={repeat !== 'none' ? 'text-green-500' : 'text-white'} />
          </button>
        </div>

        {showVisualizer && (
          <div className="w-64 h-32">
            <Visualizer />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MusicPlayer;
