import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDrum, FaGlobe, FaLink, FaUsers, FaVrCardboard, FaWaveSquare } from "react-icons/fa";
import { useQuantumState } from "~/hooks/useQuantumState";
import { useVenue } from "~/hooks/useVenue";
import { RhythmVisualizer } from "~/components/visualizers/RhythmVisualizer";
import { culturalBiomes } from "~/modules/venues/terrain/culturalBiomes";

interface RhythmPattern {
  id: string;
  name: string;
  origin: {
    region: string;
    coordinates: [number, number];
    culture: string;
  };
  pattern: number[];
  tempo: number;
  subdivision: number;
  culturalContext: string;
  connections: {
    relatedPatterns: string[];
    evolutionPath: string[];
    modernAdaptations: string[];
  };
  virtualVenueZone?: string;
}

interface CollaborativeSession {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar: string;
    instrument: string;
  }[];
  activePattern: RhythmPattern;
  variations: {
    id: string;
    creator: string;
    pattern: number[];
  }[];
}

export function GlobalRhythmExplorer() {
  const [selectedPattern, setSelectedPattern] = useState<RhythmPattern | null>(null);
  const [activeSession, setActiveSession] = useState<CollaborativeSession | null>(null);
  const [viewMode, setViewMode] = useState<'map' | '3d' | 'quantum'>('map');
  const { quantumField } = useQuantumState();
  const { connectToVenue, activeZones } = useVenue();
  const visualizerRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (selectedPattern?.virtualVenueZone) {
      connectToVenue(selectedPattern.virtualVenueZone);
    }
  }, [selectedPattern]);

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FaDrum className="text-purple-400" /> Global Rhythm Explorer
        </h2>
        <div className="flex gap-2">
          {['map', '3d', 'quantum'].map(mode => (
            <motion.button
              key={mode}
              onClick={() => setViewMode(mode as any)}
              className={`p-2 rounded-lg ${viewMode === mode ? 'bg-purple-500' : 'bg-white/10'}`}
              whileHover={{ scale: 1.05 }}
            >
              {mode === 'map' && <FaGlobe />}
              {mode === '3d' && <FaVrCardboard />}
              {mode === 'quantum' && <FaWaveSquare />}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="relative h-96 bg-black/20 rounded-lg overflow-hidden">
            <canvas 
              ref={visualizerRef}
              className="absolute inset-0 w-full h-full"
            />
            {selectedPattern && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">{selectedPattern.name}</h3>
                    <p className="text-sm opacity-70">
                      {selectedPattern.origin.culture} • {selectedPattern.origin.region}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-purple-500/20 px-3 py-1 rounded-full text-sm">
                      Learn Pattern
                    </button>
                    <button className="bg-blue-500/20 px-3 py-1 rounded-full text-sm">
                      Enter Virtual Space
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            {culturalBiomes.slice(0, 3).map(biome => (
              <motion.button
                key={biome.id}
                className="bg-white/5 p-4 rounded-lg text-left"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="font-semibold mb-1">{biome.name}</h3>
                <p className="text-sm opacity-70">
                  {biome.activePatterns} active patterns
                </p>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <motion.div 
            className="bg-white/5 rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <FaUsers className="text-green-400" />
              <h3 className="font-semibold">Live Sessions</h3>
            </div>
            <div className="space-y-2">
              {['West African Drumming', 'Brazilian Samba', 'Indian Tabla'].map(session => (
                <motion.div
                  key={session}
                  className="bg-black/20 p-3 rounded-lg"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex justify-between items-center">
                    <span>{session}</span>
                    <span className="text-xs bg-green-500/20 px-2 py-1 rounded-full">
                      4 playing
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/5 rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <FaLink className="text-blue-400" />
              <h3 className="font-semibold">Pattern Connections</h3>
            </div>
            <div className="relative h-40">
              {/* Interactive rhythm connection visualization */}
              <div className="absolute inset-0 flex items-center justify-center text-sm opacity-70">
                Discover rhythm connections across cultures
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
