import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownProps {
  endTime: string;
  onComplete?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const FlashSaleCountdown: FC<CountdownProps> = ({ 
  endTime, 
  onComplete,
  size = 'md' 
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endTime).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        onComplete?.();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      setIsUrgent(difference < 3600000); // Less than 1 hour

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onComplete]);

  const sizeClasses = {
    sm: 'text-sm p-1',
    md: 'text-base p-2',
    lg: 'text-lg p-3'
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <AnimatePresence key={unit} mode="popLayout">
          <motion.div
            key={value}
            className={`flex flex-col items-center ${isUrgent ? 'text-red-500' : 'text-gray-700'}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <motion.div
              className={`bg-white rounded-lg shadow-md font-mono font-bold ${sizeClasses[size]}`}
              animate={isUrgent ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: isUrgent ? Infinity : 0 }}
            >
              {String(value).padStart(2, '0')}
            </motion.div>
            <span className="text-xs capitalize mt-1">{unit}</span>
          </motion.div>
          {unit !== 'seconds' && (
            <span className="text-gray-400 font-bold">:</span>
          )}
        </AnimatePresence>
      ))}
    </div>
  );
};
