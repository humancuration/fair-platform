import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMagic, FaUsers, FaLayerGroup, FaLightbulb, FaHeart, FaShare } from "react-icons/fa";
import { useQuantumState } from "~/hooks/useQuantumState";
import { MultitrackVisualizer } from "~/components/visualizers/MultitrackVisualizer";

interface RemixLayer {
  id: string;
  type: 'melody' | 'rhythm' | 'harmony' | 'effects';
  creator: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: string;
  votes: number;
  stems: {
    url: string;
    volume: number;
    effects: string[];
  }[];
}

interface CollaborativeIdea {
  id: string;
  type: 'suggestion' | 'experiment' | 'variation';
  description: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
  };
  preview?: string;
  votes: number;
  tags: string[];
}

export function CollaborativeRemixStudio() {
  const [activeLayers, setActiveLayers] = useState<RemixLayer[]>([]);
  const [ideas, setIdeas] = useState<CollaborativeIdea[]>([]);
  const { quantumField } = useQuantumState();

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FaMagic className="text-purple-400" /> Remix Laboratory
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-sm bg-purple-500/20 px-3 py-1 rounded-full">
            8 collaborators online
          </span>
          <motion.button
            className="bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            Share Remix
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-black/20 rounded-lg p-4 mb-4">
            <MultitrackVisualizer 
              layers={activeLayers}
              quantumField={quantumField}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['Melody', 'Rhythm', 'Harmony', 'Effects'].map(layer => (
              <motion.button
                key={layer}
                className="bg-white/5 p-4 rounded-lg"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FaLayerGroup className="text-purple-400" />
                  <span>{layer}</span>
                </div>
                <div className="text-xs opacity-70">
                  3 variations
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FaLightbulb /> Collaborative Ideas
            </h3>
            <div className="space-y-3">
              {ideas.map(idea => (
                <motion.div 
                  key={idea.id}
                  className="bg-black/20 p-3 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <img 
                      src={idea.creator.avatar}
                      alt={idea.creator.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm">{idea.creator.name}</span>
                  </div>
                  <p className="text-sm mb-2">{idea.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {idea.tags.map(tag => (
                        <span key={tag} className="text-xs bg-white/10 px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="hover:text-purple-400">
                        <FaHeart />
                      </button>
                      <span className="text-sm">{idea.votes}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.button
            className="w-full bg-white/5 p-4 rounded-lg text-left"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2">
              <FaUsers className="text-green-400" />
              <span className="font-semibold">Start Jam Session</span>
            </div>
            <p className="text-sm opacity-70 mt-1">
              Collaborate in real-time with other musicians
            </p>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
