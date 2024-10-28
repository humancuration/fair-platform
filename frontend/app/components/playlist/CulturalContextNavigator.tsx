import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGlobe, FaBook, FaTheaterMasks, FaLandmark, FaUsers } from "react-icons/fa";
import { usePlaylist } from "~/hooks/usePlaylist";
import { WorldMap } from "~/components/visualizers/WorldMap";

interface CulturalContext {
  region: string;
  era: string;
  traditions: string[];
  significance: string;
  relatedArtforms: string[];
  historicalEvents: {
    year: number;
    event: string;
    impact: string;
  }[];
  contemporaryInfluence: {
    genres: string[];
    artists: string[];
    movements: string[];
  };
}

export function CulturalContextNavigator() {
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [timelinePosition, setTimelinePosition] = useState(0);
  const { currentTrack } = usePlaylist();

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
        <FaGlobe className="text-blue-400" /> Cultural Journey
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="relative h-96 bg-black/20 rounded-lg overflow-hidden">
            <WorldMap 
              highlightedRegions={["West Africa", "Caribbean", "North America"]}
              connections={[
                { from: "West Africa", to: "Caribbean", strength: 0.8 },
                { from: "Caribbean", to: "North America", strength: 0.6 }
              ]}
            />
          </div>
        </div>

        <div className="space-y-4">
          <motion.div 
            className="bg-white/5 rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <FaLandmark className="text-yellow-400" />
              <h3 className="font-semibold">Historical Context</h3>
            </div>
            <div className="text-sm space-y-2">
              <p>Era: 1960s Civil Rights Movement</p>
              <p>Social Impact: Voice of cultural revolution</p>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/5 rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <FaTheaterMasks className="text-purple-400" />
              <h3 className="font-semibold">Artistic Connections</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Dance", "Visual Art", "Poetry", "Fashion"].map(art => (
                <span key={art} className="text-xs bg-white/10 px-2 py-1 rounded-full">
                  {art}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/5 rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <FaUsers className="text-green-400" />
              <h3 className="font-semibold">Community Impact</h3>
            </div>
            <div className="text-sm opacity-70">
              This musical style helped build communities and preserve cultural heritage
            </div>
          </motion.div>
        </div>
      </div>

      {/* Interactive Timeline */}
      <div className="mt-6">
        <div className="relative h-2 bg-white/10 rounded-full">
          <motion.div 
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
            animate={{ width: `${timelinePosition}%` }}
          />
        </div>
      </div>
    </div>
  );
}
