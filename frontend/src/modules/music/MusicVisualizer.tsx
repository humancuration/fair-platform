import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useMusicPlayer } from '@contexts/MusicPlayerContext';

const VisualizerCanvas = styled.canvas`
  width: 100%;
  height: 100px;
`;

const MusicVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentTrack, isPlaying } = useMusicPlayer();

  useEffect(() => {
    if (!currentTrack || !isPlaying || !canvasRef.current) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const audio = new Audio(currentTrack.url);
    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    audio.play();
    draw();

    return () => {
      audio.pause();
      audioContext.close();
    };
  }, [currentTrack, isPlaying]);

  return <VisualizerCanvas ref={canvasRef} />;
};

export default MusicVisualizer;
