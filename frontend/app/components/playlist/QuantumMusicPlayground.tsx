import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaAtom, FaVolumeUp, FaMagic, FaUsers, FaProjectDiagram, FaBrain } from "react-icons/fa";
import { useQuantumState } from "~/hooks/useQuantumState";
import { useCollaboration } from "~/hooks/useCollaboration";
import { QuantumWaveform } from "~/components/visualizers/QuantumWaveform";

interface QuantumNote {
  id: string;
  frequency: number;
  amplitude: number;
  phase: number;
  entangledWith: string[];
  superposition: {
    states: string[];
    probability: number;
  };
  creator: {
    id: string;
    name: string;
  };
}

interface QuantumInstrument {
  type: 'wave' | 'particle' | 'field' | 'resonator';
  parameters: {
    entanglementStrength: number;
    superpositionStates: number;
    quantumCoherence: number;
  };
  visualMode: 'orbital' | 'wave' | 'probability';
}

export function QuantumMusicPlayground() {
  const [activeNotes, setActiveNotes] = useState<QuantumNote[]>([]);
  const [selectedInstrument, setSelectedInstrument] = useState<QuantumInstrument | null>(null);
  const [coherenceLevel, setCoherenceLevel] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { quantumField, entangleParticles } = useQuantumState();
  const { onlineCollaborators } = useCollaboration();

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FaAtom className="text-purple-400 animate-spin-slow" /> 
          Quantum Music Lab
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-sm bg-purple-500/20 px-3 py-1 rounded-full">
            {onlineCollaborators.length} quantum explorers
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 rounded-lg"
          >
            Share Creation
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="relative h-96 bg-black/20 rounded-lg overflow-hidden">
            <canvas 
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
            />
            <QuantumWaveform 
              notes={activeNotes}
              quantumField={quantumField}
              coherenceLevel={coherenceLevel}
            />

            {/* Quantum Instrument Controls */}
            <motion.div 
              className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="grid grid-cols-4 gap-4">
                {['wave', 'particle', 'field', 'resonator'].map(type => (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.05 }}
                    className={`p-4 rounded-lg ${
                      selectedInstrument?.type === type ? 'bg-purple-500' : 'bg-white/10'
                    }`}
                  >
                    <div className="text-center">
                      <FaMagic className="mx-auto mb-2" />
                      <span className="text-sm capitalize">{type}</span>
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
              <FaBrain className="text-blue-400" />
              <h3 className="font-semibold">Quantum Properties</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Entanglement Strength</span>
                  <span>{Math.round(quantumField.entanglement * 100)}%</span>
                </div>
                <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                    animate={{ width: `${quantumField.entanglement * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Superposition States</span>
                  <span>{activeNotes.length} active</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeNotes.map(note => (
                    <motion.div
                      key={note.id}
                      className="px-2 py-1 bg-white/10 rounded-full text-xs"
                      whileHover={{ scale: 1.1 }}
                    >
                      {note.superposition.states[0]}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/5 rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <FaProjectDiagram className="text-green-400" />
              <h3 className="font-semibold">Quantum Network</h3>
            </div>
            <div className="space-y-2">
              {onlineCollaborators.map(collaborator => (
                <motion.div
                  key={collaborator.id}
                  className="bg-black/20 p-3 rounded-lg"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img 
                        src={collaborator.avatar}
                        alt={collaborator.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span>{collaborator.name}</span>
                    </div>
                    <span className="text-xs bg-purple-500/20 px-2 py-1 rounded-full">
                      {collaborator.instrument}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
