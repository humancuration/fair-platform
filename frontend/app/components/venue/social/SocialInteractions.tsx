import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaMusic, FaHandSparkles } from 'react-icons/fa';

// Reference existing interfaces from VenueSocialSpace.tsx
interface Reaction {
  id: string;
  type: 'heart' | 'bounce' | 'spiral' | 'wave';
  position: { x: number; y: number };
  userId: string;
  username: string;
  timestamp: number;
}

export function SocialInteractions() {
  const [reactions, setReactions] = useState<Reaction[]>([]);

  const handleReaction = (type: Reaction['type'], position: { x: number; y: number }) => {
    const newReaction: Reaction = {
      id: crypto.randomUUID(),
      type,
      position,
      userId: 'current-user',
      username: 'Current User',
      timestamp: Date.now()
    };

    setReactions(prev => [...prev, newReaction]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 2000);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4">
      <div className="flex justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-full bg-pink-500 text-white"
          onClick={() => handleReaction('heart', { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight })}
        >
          <FaHeart />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-full bg-purple-500 text-white"
          onClick={() => handleReaction('bounce', { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight })}
        >
          <FaMusic />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-full bg-blue-500 text-white"
          onClick={() => handleReaction('wave', { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight })}
        >
          <FaHandSparkles />
        </motion.button>
      </div>

      <AnimatePresence>
        {reactions.map(reaction => (
          <motion.div
            key={reaction.id}
            className="absolute pointer-events-none"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            style={{ left: reaction.position.x, top: reaction.position.y }}
          >
            {reaction.type === 'heart' && '❤️'}
            {reaction.type === 'bounce' && '🎵'}
            {reaction.type === 'wave' && '👋'}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}