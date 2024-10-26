import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnimatedHeadingProps {
  phrases?: string[];
  colors?: string[];
  speeds?: number[];
  className?: string;
}

export default function AnimatedHeading({
  phrases = [
    'Welcome to the Marketplace 🛒',
    'Find Your Next Favorite Product ⭐',
    'Join Our Community 🤝',
    'Discover Amazing Deals 💰',
  ],
  colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
  speeds = [50, 75, 100, 125, 150],
  className = ''
}: AnimatedHeadingProps) {
  const [text, setText] = useState('');
  const [colorIndex, setColorIndex] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    let currentText = '';
    let currentChar = 0;
    let timeoutId: NodeJS.Timeout;

    const typeChar = () => {
      if (currentChar < phrases[phraseIndex].length) {
        currentText += phrases[phraseIndex][currentChar];
        setText(currentText);
        setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
        currentChar++;
        timeoutId = setTimeout(
          typeChar, 
          speeds[Math.floor(Math.random() * speeds.length)]
        );
      } else {
        timeoutId = setTimeout(() => {
          setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
          currentText = '';
          currentChar = 0;
          typeChar();
        }, 2000);
      }
    };

    typeChar();

    return () => clearTimeout(timeoutId);
  }, [phraseIndex, phrases, colors, speeds]);

  return (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <motion.span
        style={{ color: colors[colorIndex] }}
        className="transition-colors duration-500"
      >
        {text}
      </motion.span>
    </motion.h1>
  );
}
