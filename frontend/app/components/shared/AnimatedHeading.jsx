import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TypedText = styled.span`
  transition: color 0.5s ease;
  color: ${props => props.color};
`;

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
const speeds = [50, 75, 100, 125, 150];
const phrases = [
  'Welcome to the Marketplace 🛒',
  'Find Your Next Favorite Product ⭐',
  'Join Our Community 🤝',
  'Discover Amazing Deals 💰',
];

const AnimatedHeading = () => {
  const [text, setText] = useState('');
  const [colorIndex, setColorIndex] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    let currentText = '';
    let currentChar = 0;

    const typeChar = () => {
      if (currentChar < phrases[phraseIndex].length) {
        currentText += phrases[phraseIndex][currentChar];
        setText(currentText);
        setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
        currentChar++;
        setTimeout(typeChar, speeds[Math.floor(Math.random() * speeds.length)]);
      } else {
        setTimeout(() => {
          setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
          currentText = '';
          currentChar = 0;
          typeChar();
        }, 2000);
      }
    };

    typeChar();
  }, [phraseIndex]);

  return (
    <h1>
      <TypedText color={colors[colorIndex]}>{text}</TypedText>
    </h1>
  );
};

export default AnimatedHeading;
