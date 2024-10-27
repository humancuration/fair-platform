import React from 'react';
import { motion } from 'framer-motion';
import { FaMoon, FaSun, FaFire, FaWater, FaLeaf, FaStar } from 'react-icons/fa';

interface MoodZoneProps {
  type: 'chill' | 'energetic' | 'mystical' | 'nature' | 'urban' | 'cosmic';
  intensity: number;
  participants: number;
  onEnter: () => void;
  onLeave: () => void;
}

const zoneColors = {
  chill: ['#2E3440', '#4C566A'],
  energetic: ['#BF616A', '#D08770'],
  mystical: ['#B48EAD', '#A3BE8C'],
  nature: ['#A3BE8C', '#88C0D0'],
  urban: ['#5E81AC', '#81A1C1'],
  cosmic: ['#4C566A', '#2E3440']
};

const zoneIcons = {
  chill: FaMoon,
  energetic: FaSun,
  mystical: FaStar,
  nature: FaLeaf,
  urban: FaFire,
  cosmic: FaWater
};

export function MoodZone({ type, intensity, participants, onEnter, onLeave }: MoodZoneProps) {
  const Icon = zoneIcons[type];
  
  return (
    <motion.div
      className="relative rounded-xl overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div 
        className="absolute inset-0 bg-gradient-to-br opacity-80"
        style={{ 
          backgroundImage: `linear-gradient(to bottom right, ${zoneColors[type][0]}, ${zoneColors[type][1]})` 
        }}
      />
      
      <div className="relative p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Icon className="text-2xl" />
          <h3 className="text-xl font-bold capitalize">{type} Zone</h3>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Intensity</span>
            <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${intensity * 100}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between">
            <span>Participants</span>
            <span>{participants}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}