import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const TypedText = styled(motion.span)`
  transition: color 0.5s ease;
  color: ${props => props.color};
`;

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
const speeds = [50, 75, 100, 125, 150];
const phrases = [
  'Welcome to the Fair Platform 🌱',
  'Build Together 🤝',
  'Share Knowledge 📚',
  'Grow Communities 🌿',
];

const AnimatedHeading: React.FC = () => {
  const [text, setText] = useState('');
  const [colorIndex, setColorIndex] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    let currentText = '';
    let currentChar = 0;
    let cleanup = false;

    const typeChar = () => {
      if (cleanup) return;

      if (currentChar < phrases[phraseIndex].length) {
        currentText += phrases[phraseIndex][currentChar];
        setText(currentText);
        setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
        currentChar++;
        setTimeout(typeChar, speeds[Math.floor(Math.random() * speeds.length)]);
      } else {
        setTimeout(() => {
          if (!cleanup) {
            setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
            currentText = '';
            currentChar = 0;
            typeChar();
          }
        }, 2000);
      }
    };

    typeChar();

    return () => {
      cleanup = true;
    };
  }, [phraseIndex]);

  return (
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-4xl font-bold"
    >
      <TypedText color={colors[colorIndex]}>{text}</TypedText>
    </motion.h1>
  );
};

export default AnimatedHeading; 