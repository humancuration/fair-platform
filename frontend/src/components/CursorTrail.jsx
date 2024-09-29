// CursorTrail.jsx

import React, { useEffect } from 'react';

const CursorTrail = () => {
  useEffect(() => {
    const dots = [];
    const mouse = { x: 0, y: 0 };

    const createDot = () => {
      const dot = document.createElement('div');
      dot.className = 'trail-dot';
      document.body.appendChild(dot);
      dots.push(dot);
    };

    for (let i = 0; i < 10; i++) {
      createDot();
    }

    const animateDots = () => {
      let x = mouse.x;
      let y = mouse.y;

      dots.forEach((dot, index) => {
        dot.style.left = x + 'px';
        dot.style.top = y + 'px';
        dot.style.backgroundColor = `hsl(${index * 36}, 100%, 50%)`;

        x += (mouse.x - x) * 0.3;
        y += (mouse.y - y) * 0.3;
      });

      requestAnimationFrame(animateDots);
    };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    animateDots();

    return () => {
      dots.forEach((dot) => document.body.removeChild(dot));
    };
  }, []);

  return null;
};

export default CursorTrail;
