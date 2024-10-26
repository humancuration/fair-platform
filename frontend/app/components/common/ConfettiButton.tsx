import { useCallback } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface ConfettiButtonProps {
  text?: string;
  colors?: string[];
  onConfetti?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function ConfettiButton({ 
  text = 'Celebrate!', 
  colors = ['#ff6f61', '#ffec5c', '#2f1b0c'],
  onConfetti,
  className = '',
  disabled = false
}: ConfettiButtonProps) {
  const handleClick = useCallback(() => {
    if (disabled) return;

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors,
      disableForReducedMotion: true
    });

    onConfetti?.();
  }, [colors, disabled, onConfetti]);

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`
        px-6 py-3 rounded-md font-medium
        bg-yellow-400 dark:bg-yellow-500
        text-gray-900 dark:text-gray-900
        hover:bg-yellow-500 dark:hover:bg-yellow-400
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
        ${className}
      `}
    >
      {text}
    </motion.button>
  );
}
