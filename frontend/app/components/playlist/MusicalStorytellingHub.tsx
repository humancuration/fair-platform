import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBook, FaGlobe, FaHeart, FaPalette, FaFilm, FaTheaterMasks } from "react-icons/fa";
import { usePlaylist } from "~/hooks/usePlaylist";

interface StoryElement {
  id: string;
  type: 'memory' | 'cultural' | 'visual' | 'emotion' | 'movement';
  content: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
  };
  media?: {
    type: string;
    url: string;
  };
  connections: string[];
  reactions: {
    type: 'resonance' | 'memory' | 'inspiration';
    count: number;
  }[];
}

export function MusicalStorytellingHub() {
  const [activeStories, setActiveStories] = useState<StoryElement[]>([]);
  const { currentTrack } = usePlaylist();

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
        <FaBook className="text-purple-400" /> Musical Stories
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <motion.div 
            className="bg-white/5 rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <FaGlobe className="text-blue-400" />
              <h3 className="font-semibold">Cultural Journey</h3>
            </div>
            <p className="text-sm opacity-70">
              This melody carries echoes of traditional West African rhythms, 
              transformed through generations of musical evolution...
            </p>
            <div className="mt-4 flex gap-2">
              <span className="text-xs bg-blue-500/20 px-2 py-1 rounded-full">
                Cultural Heritage
              </span>
              <span className="text-xs bg-purple-500/20 px-2 py-1 rounded-full">
                Musical Migration
              </span>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/5 rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <FaPalette className="text-green-400" />
              <h3 className="font-semibold">Visual Stories</h3>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {/* Community-contributed artwork inspired by the music */}
              <div className="aspect-square bg-black/20 rounded-lg"></div>
              <div className="aspect-square bg-black/20 rounded-lg"></div>
              <div className="aspect-square bg-black/20 rounded-lg"></div>
            </div>
            <button className="text-sm text-purple-400 hover:underline">
              Add your visualization
            </button>
          </motion.div>
        </div>

        <div className="space-y-4">
          <motion.div 
            className="bg-white/5 rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <FaHeart className="text-red-400" />
              <h3 className="font-semibold">Emotional Resonance</h3>
            </div>
            <div className="relative h-32 bg-black/20 rounded-lg overflow-hidden">
              {/* Emotional visualization goes here */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm opacity-70">
                  47 people feel uplifted by this section
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/5 rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <FaFilm className="text-yellow-400" />
              <h3 className="font-semibold">Memory Cinema</h3>
            </div>
            <div className="space-y-2">
              {['Summer festivals', 'Road trips', 'First dance'].map(memory => (
                <motion.div 
                  key={memory}
                  className="bg-black/20 p-2 rounded-lg text-sm"
                  whileHover={{ x: 5 }}
                >
                  {memory}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div 
        className="mt-6 bg-white/5 rounded-lg p-4"
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <FaTheaterMasks className="text-purple-400" />
          <h3 className="font-semibold">Collective Narrative</h3>
        </div>
        <div className="relative h-20 bg-black/20 rounded-lg">
          {/* Interactive story timeline visualization */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="bg-purple-500/20 px-4 py-2 rounded-full text-sm">
              Add to the story
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
