import { useState } from "react";
import { motion } from "framer-motion";
import { FaHistory, FaCode, FaUserFriends, FaRobot, FaLightbulb } from "react-icons/fa";

interface TimelineEvent {
  id: string;
  type: 'creation' | 'collaboration' | 'ai_curation' | 'fork' | 'merge';
  timestamp: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  details: {
    description: string;
    changes?: {
      added: string[];
      removed: string[];
      reordered: boolean;
    };
    aiConfidence?: number;
  };
}

export function PlaylistEvolutionTimeline() {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FaHistory /> Playlist Evolution
        </h2>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500 to-blue-500" />

        <div className="space-y-6">
          {/* Timeline Events */}
          <motion.div 
            className="relative pl-16"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="absolute left-6 w-4 h-4 rounded-full bg-purple-500 transform -translate-x-1/2 -translate-y-1/2">
              <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-75" />
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaRobot className="text-purple-400" />
                <span className="font-semibold">AI Curation</span>
                <span className="text-xs opacity-70">2 hours ago</span>
              </div>
              <p className="text-sm opacity-70">
                AI suggested 3 tracks based on collective mood analysis
              </p>
              <div className="mt-2 flex gap-2">
                <span className="text-xs bg-green-500/20 px-2 py-1 rounded-full">
                  98% Match
                </span>
                <span className="text-xs bg-blue-500/20 px-2 py-1 rounded-full">
                  Mood: Energetic
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="relative pl-16"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute left-6 w-4 h-4 rounded-full bg-blue-500 transform -translate-x-1/2 -translate-y-1/2" />
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaUserFriends className="text-blue-400" />
                <span className="font-semibold">Collaborative Session</span>
                <span className="text-xs opacity-70">Yesterday</span>
              </div>
              <p className="text-sm opacity-70">
                3 contributors refined the track order and added transitions
              </p>
              <div className="mt-2 flex -space-x-2">
                {/* Contributor avatars */}
              </div>
            </div>
          </motion.div>

          {/* Add more timeline events */}
        </div>
      </div>
    </div>
  );
}
