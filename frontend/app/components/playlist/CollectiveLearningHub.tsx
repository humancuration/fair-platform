import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGraduationCap, FaLightbulb, FaPuzzlePiece, FaChartLine } from "react-icons/fa";
import type { Track } from "~/types/playlist";

interface LearningResource {
  type: 'theory' | 'history' | 'production' | 'culture';
  title: string;
  content: string;
  difficulty: 1 | 2 | 3;
  relatedTracks: Track[];
  contributors: string[];
}

export function CollectiveLearningHub() {
  const [activeResource, setActiveResource] = useState<LearningResource | null>(null);
  const [learningPath, setLearningPath] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FaGraduationCap /> Collective Learning Space
        </h2>
        <select 
          value={learningPath}
          onChange={(e) => setLearningPath(e.target.value as any)}
          className="bg-white/10 rounded-lg px-3 py-1"
        >
          <option value="beginner">Beginner Path</option>
          <option value="intermediate">Intermediate Path</option>
          <option value="advanced">Advanced Path</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <motion.div 
          className="bg-white/5 rounded-lg p-4"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <FaLightbulb className="text-yellow-400" />
            <h3 className="font-semibold">Music Theory</h3>
          </div>
          <p className="text-sm opacity-70">
            Learn about harmony, rhythm, and composition through your playlist
          </p>
        </motion.div>

        <motion.div 
          className="bg-white/5 rounded-lg p-4"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <FaChartLine className="text-green-400" />
            <h3 className="font-semibold">Production Techniques</h3>
          </div>
          <p className="text-sm opacity-70">
            Discover how your favorite tracks were produced
          </p>
        </motion.div>
      </div>

      <div className="relative">
        <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-blue-500" />
        <div className="space-y-4 pl-6">
          {/* Dynamic learning content based on playlist analysis */}
          <motion.div 
            className="bg-white/5 rounded-lg p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h4 className="font-semibold mb-2">Currently Learning</h4>
            <p className="text-sm opacity-70">
              Exploring the use of modal interchange in modern music production
            </p>
            <div className="mt-2 flex gap-2">
              <span className="text-xs bg-purple-500/20 px-2 py-1 rounded-full">
                Theory
              </span>
              <span className="text-xs bg-blue-500/20 px-2 py-1 rounded-full">
                Production
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
