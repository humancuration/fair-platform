import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Theme } from '@mui/material';

interface Visualizer2DProps {
  getAnalyserData: () => Uint8Array;
  theme: Theme;
}

export const Visualizer2D = forwardRef<HTMLCanvasElement, Visualizer2DProps>(
  ({ getAnalyserData, theme }, ref) => {
    useEffect(() => {
      const canvas = ref as React.MutableRefObject<HTMLCanvasElement>;
      if (!canvas.current) return;

      const ctx = canvas.current.getContext('2d')!;
      let animationFrame: number;

      const draw = () => {
        const data = getAnalyserData();
        const width = canvas.current.width;
        const height = canvas.current.height;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = theme.palette.background.default;
        ctx.fillRect(0, 0, width, height);

        const barWidth = (width / data.length) * 2.5;
        let x = 0;

        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, theme.palette.primary.light);
        gradient.addColorStop(1, theme.palette.primary.dark);

        for (let i = 0; i < data.length; i++) {
          const barHeight = (data[i] / 255) * height * 0.8;
          
          // Draw bar with gradient
          ctx.fillStyle = gradient;
          ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
          
          // Add glow effect
          ctx.shadowBlur = 15;
          ctx.shadowColor = theme.palette.primary.main;
          
          x += barWidth;
        }

        animationFrame = requestAnimationFrame(draw);
      };

      draw();

      return () => {
        cancelAnimationFrame(animationFrame);
      };
    }, [getAnalyserData, theme]);

    useImperativeHandle(ref, () => {
      return document.createElement('canvas');
    });

    return <canvas ref={ref} />;
  }
);
