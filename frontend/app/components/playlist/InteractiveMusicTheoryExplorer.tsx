import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGuitar, FaDrum, FaKeyboard, FaBrain, FaShare, FaGraduationCap } from "react-icons/fa";
import { usePlaylist } from "~/hooks/usePlaylist";
import { PianoRoll } from "~/components/music/PianoRoll";
import { ChordWheel } from "~/components/music/ChordWheel";

interface TheoryLesson {
  id: string;
  type: 'scale' | 'chord' | 'rhythm' | 'form';
  title: string;
  difficulty: 1 | 2 | 3;
  concepts: string[];
  examples: {
    timestamp: number;
    description: string;
  }[];
  communityNotes: {
    userId: string;
    note: string;
    helpful: number;
  }[];
}

export function InteractiveMusicTheoryExplorer() {
  const [activeLesson, setActiveLesson] = useState<TheoryLesson | null>(null);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});
  const { currentTrack } = usePlaylist();

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FaBrain className="text-purple-400" /> Music Theory Journey
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm bg-green-500/20 px-3 py-1 rounded-full">
            Level {Object.keys(userProgress).length}
          </span>
          <FaShare className="cursor-pointer hover:text-purple-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="bg-black/20 rounded-lg p-4 mb-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <FaKeyboard /> Current Track Analysis
            </h3>
            <div className="h-40 relative">
              <PianoRoll 
                notes={currentTrack?.notes || []}
                highlightTheory={activeLesson?.type === 'chord'}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.button
              className="bg-white/5 p-4 rounded-lg text-left"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <FaGuitar className="text-yellow-400" />
                <span className="font-semibold">Chord Theory</span>
              </div>
              <p className="text-sm opacity-70">
                Explore the harmonic structure
              </p>
            </motion.button>

            <motion.button
              className="bg-white/5 p-4 rounded-lg text-left"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <FaDrum className="text-blue-400" />
                <span className="font-semibold">Rhythm Analysis</span>
              </div>
              <p className="text-sm opacity-70">
                Understand rhythmic patterns
              </p>
            </motion.button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FaGraduationCap /> Community Learning
            </h3>
            <div className="space-y-3">
              {['Modal Interchange', 'Polyrhythms', 'Extended Harmony'].map(topic => (
                <motion.div 
                  key={topic}
                  className="bg-black/20 p-3 rounded-lg"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex justify-between items-center">
                    <span>{topic}</span>
                    <span className="text-xs bg-purple-500/20 px-2 py-1 rounded-full">
                      3 learning together
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div 
            className="bg-white/5 rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="font-semibold mb-2">Your Progress</h3>
            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: '60%' }}
              />
            </div>
            <div className="mt-2 text-sm opacity-70">
              12 concepts mastered, 8 in progress
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mt-6 bg-white/5 rounded-lg p-4">
        <h3 className="font-semibold mb-4">Theory in Context</h3>
        <div className="relative h-20">
          <ChordWheel 
            progression={currentTrack?.chordProgression}
            highlightMode="learning"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              className="bg-purple-500/20 px-4 py-2 rounded-full text-sm"
              whileHover={{ scale: 1.1 }}
            >
              Try it yourself!
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
