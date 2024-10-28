import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMemory, FaGlobe, FaHeart, FaTimeline, FaDna, FaVrCardboard } from "react-icons/fa";
import { useQuantumState } from "~/hooks/useQuantumState";
import { useCollaboration } from "~/hooks/useCollaboration";
import { MemoryVisualizer } from "~/components/visualizers/MemoryVisualizer";

interface MusicalMemory {
  id: string;
  type: 'personal' | 'cultural' | 'historical' | 'collective';
  title: string;
  description: string;
  era: string;
  location: {
    coordinates: [number, number];
    place: string;
    culture: string;
  };
  contributors: {
    id: string;
    name: string;
    avatar: string;
    connection: string;
  }[];
  artifacts: {
    type: 'audio' | 'image' | 'video' | 'story' | 'notation';
    url: string;
    description: string;
  }[];
  emotionalSignature: {
    joy: number;
    nostalgia: number;
    significance: number;
    resonance: number;
  };
  quantumState: {
    entanglement: number;
    collectiveResonance: number;
    timelineVariants: string[];
  };
}

export function MusicalMemoryCollector() {
  const [activeMemories, setActiveMemories] = useState<MusicalMemory[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<MusicalMemory | null>(null);
  const [viewMode, setViewMode] = useState<'map' | '3d' | 'timeline' | 'quantum'>('map');
  const { quantumField } = useQuantumState();
  const { onlineCollaborators } = useCollaboration();

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FaMemory className="text-purple-400" /> Musical Memory Vault
        </h2>
        <div className="flex gap-2">
          {[
            { id: 'map', icon: FaGlobe, label: 'World Map' },
            { id: '3d', icon: FaVrCardboard, label: '3D Space' },
            { id: 'timeline', icon: FaTimeline, label: 'Timeline' },
            { id: 'quantum', icon: FaDna, label: 'Quantum View' }
          ].map(mode => (
            <motion.button
              key={mode.id}
              onClick={() => setViewMode(mode.id as any)}
              className={`p-2 rounded-lg ${viewMode === mode.id ? 'bg-purple-500' : 'bg-white/10'}`}
              whileHover={{ scale: 1.05 }}
              title={mode.label}
            >
              <mode.icon />
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="relative h-96 bg-black/20 rounded-lg overflow-hidden">
            <MemoryVisualizer 
              memories={activeMemories}
              selectedMemory={selectedMemory}
              viewMode={viewMode}
              quantumField={quantumField}
            />

            {selectedMemory && (
              <motion.div
                className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">{selectedMemory.title}</h3>
                    <p className="text-sm opacity-70">
                      {selectedMemory.location.culture} • {selectedMemory.era}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="bg-purple-500/20 px-3 py-1 rounded-full text-sm"
                    >
                      Contribute Memory
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="bg-blue-500/20 px-3 py-1 rounded-full text-sm"
                    >
                      Enter Memory Space
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-4 gap-4">
            {['Personal', 'Cultural', 'Historical', 'Collective'].map(type => (
              <motion.button
                key={type}
                className="bg-white/5 p-4 rounded-lg text-left"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="font-semibold mb-1">{type}</h3>
                <p className="text-sm opacity-70">
                  {activeMemories.filter(m => m.type === type.toLowerCase()).length} memories
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
              <FaHeart className="text-red-400" />
              <h3 className="font-semibold">Memory Resonance</h3>
            </div>
            <div className="space-y-2">
              {selectedMemory?.artifacts.map((artifact, index) => (
                <motion.div
                  key={index}
                  className="bg-black/20 p-3 rounded-lg"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="capitalize">{artifact.type}</span>
                    <span className="text-xs bg-purple-500/20 px-2 py-1 rounded-full">
                      View Artifact
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
              <FaDna className="text-green-400" />
              <h3 className="font-semibold">Memory DNA</h3>
            </div>
            {selectedMemory && (
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Collective Resonance</span>
                    <span>{Math.round(selectedMemory.quantumState.collectiveResonance * 100)}%</span>
                  </div>
                  <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                      animate={{ width: `${selectedMemory.quantumState.collectiveResonance * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedMemory.quantumState.timelineVariants.map((variant, index) => (
                    <span key={index} className="text-xs bg-white/10 px-2 py-1 rounded-full">
                      {variant}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
