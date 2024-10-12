import React from 'react';
import confetti from 'canvas-confetti';

interface ConfettiButtonProps {
  text?: string;
  colors?: string[];
  onConfetti?: () => void;
}

const ConfettiButton: React.FC<ConfettiButtonProps> = ({ 
  text = 'Celebrate!', 
  colors = ['#ff6f61', '#ffec5c', '#2f1b0c'],
  onConfetti = () => {} 
}) => {
  const handleClick = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors
    });
    onConfetti();
  };

  return (
    <button onClick={handleClick} className="confetti-button">
      {text}
    </button>
  );
};

export default ConfettiButton;
