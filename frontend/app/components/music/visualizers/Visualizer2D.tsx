import React, { forwardRef, useEffect, useRef } from 'react';
import { Theme } from '@mui/material';
import { motion } from 'framer-motion';

interface Visualizer2DProps {
  getAnalyserData: () => Uint8Array;
  theme: Theme;
}

export const Visualizer2D = forwardRef<HTMLCanvasElement, Visualizer2DProps>(
  ({ getAnalyserData, theme }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number>();

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size with device pixel ratio for sharp rendering
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const draw = () => {
        const data = getAnalyserData();
        const width = rect.width;
        const height = rect.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Create gradient based on theme
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, theme.palette.primary.dark);
        gradient.addColorStop(0.5, theme.palette.primary.main);
        gradient.addColorStop(1, theme.palette.primary.light);

        // Draw frequency bars
        const barWidth = (width / data.length) * 0.8;
        const barGap = (width / data.length) * 0.2;

        data.forEach((value, i) => {
          const percent = value / 255;
          const barHeight = height * percent * 0.9;
          const x = i * (barWidth + barGap);
          const y = height - barHeight;

          // Add glow effect
          ctx.shadowBlur = 15;
          ctx.shadowColor = theme.palette.primary.main;

          // Draw bar
          ctx.fillStyle = gradient;
          ctx.fillRect(x, y, barWidth, barHeight);

          // Add highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.fillRect(x, y, barWidth, 2);
        });

        rafRef.current = requestAnimationFrame(draw);
      };

      draw();

      return () => {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
      };
    }, [getAnalyserData, theme]);

    return (
      <motion.canvas
        ref={(node) => {
          canvasRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    );
  }
);

Visualizer2D.displayName = 'Visualizer2D';
