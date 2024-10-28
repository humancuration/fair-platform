import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaYinYang, FaTree, FaWater, FaMoon, FaWind, FaMountain, FaHeart } from "react-icons/fa";
import { useQuantumState } from "~/hooks/useQuantumState";
import { useGarden } from "~/hooks/useGarden";
import { BioResonanceVisualizer } from "~/components/visualizers/BioResonanceVisualizer";

interface MeditationState {
  frequency: number;
  resonance: number;
  harmony: number;
  flow: number;
  brainwaveState: 'alpha' | 'theta' | 'delta' | 'gamma';
  collectiveField: {
    participants: number;
    synchronicity: number;
    intention: string[];
  };
}

interface SoundScape {
  id: string;
  name: string;
  type: 'nature' | 'cosmic' | 'binaural' | 'harmonic';
  baseFrequency: number;
  harmonics: number[];
  intention: string;
  effects: {
    type: string;
    intensity: number;
    modulation: number;
  }[];
}

export function SonicMeditationSpace() {
  const [meditationState, setMeditationState] = useState<MeditationState | null>(null);
  const [activeScape, setActiveScape] = useState<SoundScape | null>(null);
  const [gardenConnection, setGardenConnection] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { quantumField } = useQuantumState();
  const { gardenState, waterPlant } = useGarden();

  useEffect(() => {
    // Connect meditation state to garden growth
    if (meditationState && gardenState) {
      const resonanceBoost = meditationState.resonance * 0.5;
      waterPlant(gardenState.selectedPlant, resonanceBoost);
    }
  }, [meditationState?.resonance]);

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FaYinYang className="text-purple-400" /> Sonic Meditation Space
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-sm bg-purple-500/20 px-3 py-1 rounded-full">
            {meditationState?.collectiveField.participants || 0} meditating
          </span>
          <motion.div 
            className="w-3 h-3 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              backgroundColor: ['#9333ea', '#3b82f6', '#9333ea']
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="relative h-96 bg-black/20 rounded-lg overflow-hidden">
            <canvas 
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
            />
            <BioResonanceVisualizer 
              meditationState={meditationState}
              quantumField={quantumField}
            />

            {/* Soundscape Controls */}
            <motion.div 
              className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="grid grid-cols-4 gap-4">
                {[
                  { icon: FaTree, label: 'Forest', freq: 432 },
                  { icon: FaWater, label: 'Ocean', freq: 528 },
                  { icon: FaMoon, label: 'Cosmic', freq: 639 },
                  { icon: FaWind, label: 'Ethereal', freq: 741 }
                ].map(scene => (
                  <motion.button
                    key={scene.label}
                    whileHover={{ scale: 1.05 }}
                    className="p-4 rounded-lg bg-white/10"
                  >
                    <div className="text-center">
                      <scene.icon className="mx-auto mb-2" />
                      <span className="text-sm">{scene.label}</span>
                      <div className="text-xs opacity-70">{scene.freq}Hz</div>
                    </div>
                  </motion.button>
                ))}
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
              <FaMountain className="text-blue-400" />
              <h3 className="font-semibold">Resonance Peaks</h3>
            </div>
            <div className="space-y-2">
              {['Alpha', 'Theta', 'Delta', 'Gamma'].map(wave => (
                <div key={wave}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{wave} Waves</span>
                    <span>{Math.round(Math.random() * 100)}%</span>
                  </div>
                  <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                      animate={{ 
                        width: ['0%', '100%', '0%'],
                      }}
                      transition={{
                        duration: 5 + Math.random() * 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/5 rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <FaHeart className="text-red-400" />
              <h3 className="font-semibold">Garden Connection</h3>
            </div>
            <div className="text-center">
              <div className="inline-block relative">
                <svg className="w-32 h-32" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#resonanceGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: gardenConnection }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                  <defs>
                    <linearGradient id="resonanceGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#9333ea" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-2xl font-bold">
                    {Math.round(gardenConnection * 100)}%
                  </div>
                </div>
              </div>
              <p className="text-sm opacity-70 mt-2">
                Resonating with Skill Tree Garden
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
