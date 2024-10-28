import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useUnifiedAudio } from '../../../contexts/UnifiedAudioContext';
import { useTheme } from '@mui/material';

const VisualizerCanvas = styled(motion.canvas)`
  width: 100%;
  height: 100px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  backdrop-filter: blur(10px);
`;

const WaveformVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { getAnalyserData } = useUnifiedAudio();
  const theme = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;

    const draw = () => {
      const data = getAnalyserData();
      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, theme.palette.primary.light);
      gradient.addColorStop(0.5, theme.palette.secondary.main);
      gradient.addColorStop(1, theme.palette.primary.dark);

      // Draw waveform
      ctx.beginPath();
      ctx.moveTo(0, height / 2);

      const sliceWidth = width / data.length;
      let x = 0;

      for (let i = 0; i < data.length; i++) {
        const v = data[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Add glow effect
      ctx.shadowBlur = 15;
      ctx.shadowColor = theme.palette.primary.main;

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [getAnalyserData, theme]);

  return (
    <VisualizerCanvas
      ref={canvasRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    />
  );
};

export default WaveformVisualizer;
