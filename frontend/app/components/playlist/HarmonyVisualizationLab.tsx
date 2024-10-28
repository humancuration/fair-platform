import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGuitar, FaVolumeUp, FaBrain, FaLightbulb, FaAtom, FaProjectDiagram } from "react-icons/fa";
import { useQuantumState } from "~/hooks/useQuantumState";
import { usePlaylist } from "~/hooks/usePlaylist";
import { HarmonicField } from "~/components/visualizers/HarmonicField";
import { ChordProgressionGraph } from "~/components/visualizers/ChordProgressionGraph";

interface HarmonicState {
  key: string;
  mode: string;
  chordProgression: string[];
  tensions: number[];
  resolution: number;
  quantumHarmonics: {
    entanglement: number;
    superposition: string[];
    interference: number;
  };
}

interface VisualizationMode {
  id: 'circle' | 'network' | 'quantum' | 'emotional' | 'cultural';
  label: string;
  description: string;
  icon: any;
}

export function HarmonyVisualizationLab() {
  const [harmonicState, setHarmonicState] = useState<HarmonicState | null>(null);
  const [activeMode, setActiveMode] = useState<VisualizationMode['id']>('circle');
  const [isExperimenting, setIsExperimenting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { quantumField } = useQuantumState();
  const { currentTrack } = usePlaylist();

  const visualizationModes: VisualizationMode[] = [
    { 
      id: 'circle', 
      label: 'Circle of Fifths',
      description: 'Traditional harmony visualization',
      icon: FaGuitar 
    },
    { 
      id: 'network', 
      label: 'Harmonic Network',
      description: 'See how chords connect',
      icon: FaProjectDiagram 
    },
    { 
      id: 'quantum', 
      label: 'Quantum Harmonics',
      description: 'Explore harmonic superpositions',
      icon: FaAtom 
    },
    // Add more modes...
  ];

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FaBrain className="text-purple-400" /> Harmony Lab
        </h2>
        <div className="flex gap-2">
          {visualizationModes.map(mode => (
            <motion.button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`p-2 rounded-lg ${activeMode === mode.id ? 'bg-purple-500' : 'bg-white/10'}`}
              whileHover={{ scale: 1.05 }}
            >
              <mode.icon />
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="relative h-96 bg-black/20 rounded-lg overflow-hidden">
            <canvas 
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
            />
            <AnimatePresence mode="wait">
              {activeMode === 'circle' && (
                <HarmonicField 
                  harmonicState={harmonicState}
                  quantumField={quantumField}
                />
              )}
              {activeMode === 'network' && (
                <ChordProgressionGraph 
                  progression={currentTrack?.chordProgression}
                  isExperimenting={isExperimenting}
                />
              )}
              {/* Add more visualizations */}
            </AnimatePresence>

            {/* Interactive Overlay */}
            <motion.div 
              className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    className="bg-purple-500/20 p-2 rounded-full"
                    onClick={() => setIsExperimenting(!isExperimenting)}
                  >
                    <FaVolumeUp />
                  </button>
                  <div>
                    <h3 className="font-bold">Current Harmony</h3>
                    <p className="text-sm opacity-70">
                      {harmonicState?.key} {harmonicState?.mode} • 
                      Tension: {Math.round(harmonicState?.tensions[0] || 0)}%
                    </p>
                  </div>
                </div>
                <button className="bg-blue-500/20 px-4 py-2 rounded-lg text-sm">
                  Experiment with Changes
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="space-y-4">
          <motion.div 
            className="bg-white/5 rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <FaLightbulb className="text-yellow-400" />
              <h3 className="font-semibold">Harmonic Insights</h3>
            </div>
            <div className="space-y-2">
              {['Modal Interchange', 'Secondary Dominants', 'Voice Leading'].map(concept => (
                <motion.div
                  key={concept}
                  className="bg-black/20 p-3 rounded-lg"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex justify-between items-center">
                    <span>{concept}</span>
                    <button className="text-xs bg-purple-500/20 px-2 py-1 rounded-full">
                      Learn More
                    </button>
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
              <FaAtom className="text-blue-400" />
              <h3 className="font-semibold">Quantum Harmony</h3>
            </div>
            <div className="text-sm space-y-2">
              <p>Harmonic Entanglement: {Math.round(harmonicState?.quantumHarmonics.entanglement * 100)}%</p>
              <p>Superposition States: {harmonicState?.quantumHarmonics.superposition.length}</p>
              <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${harmonicState?.resolution || 0}%` }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
