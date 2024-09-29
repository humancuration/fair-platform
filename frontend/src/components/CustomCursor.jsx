// CustomCursor.jsx

import React, { useEffect } from 'react';

const CustomCursor = () => {
  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    cursor.style.position = 'fixed';
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.borderRadius = '50%';
    cursor.style.backgroundColor = '#ff6f61';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999';
    cursor.style.transition = 'transform 0.1s ease-out';
    document.body.appendChild(cursor);

    const moveCursor = (e) => {
      cursor.style.transform = `translate3d(${e.clientX - 10}px, ${e.clientY - 10}px, 0)`;
    };

    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.body.removeChild(cursor);
    };
  }, []);

  return null;
};

export default CustomCursor;
