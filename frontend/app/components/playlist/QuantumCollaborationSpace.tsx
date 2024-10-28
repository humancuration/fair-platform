import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaAtom, FaUsers, FaBrain, FaLightbulb, FaWaveSquare } from "react-icons/fa";
import { useQuantumState } from "~/hooks/useQuantumState";
import { useCollaboration } from "~/hooks/useCollaboration";

interface CollaboratorState {
  id: string;
  name: string;
  avatar: string;
  quantumState: {
    resonance: number;
    entanglement: number;
    position: [number, number];
  };
}

export function QuantumCollaborationSpace() {
  const [collaborators, setCollaborators] = useState<CollaboratorState[]>([]);
  const { quantumField, entangleUsers } = useQuantumState();
  const { onlineUsers } = useCollaboration();

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FaAtom className="text-blue-400 animate-spin-slow" /> 
          Quantum Collaboration Field
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm opacity-70">
            {collaborators.length} minds connected
          </span>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="relative h-64 mb-6 bg-black/20 rounded-lg overflow-hidden">
        {/* Quantum Field Visualization */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
        
        <AnimatePresence>
          {collaborators.map(collaborator => (
            <motion.div
              key={collaborator.id}
              className="absolute"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: collaborator.quantumState.resonance,
                x: collaborator.quantumState.position[0],
                y: collaborator.quantumState.position[1]
              }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <div className="relative">
                <img 
                  src={collaborator.avatar}
                  alt={collaborator.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div 
          className="bg-white/5 rounded-lg p-4"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <FaBrain className="text-purple-400" />
            <h3 className="font-semibold">Collective Consciousness</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-70">Field Resonance</span>
              <span className="text-sm">{Math.round(quantumField.resonance * 100)}%</span>
            </div>
            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${quantumField.resonance * 100}%` }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white/5 rounded-lg p-4"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <FaWaveSquare className="text-blue-400" />
            <h3 className="font-semibold">Quantum Insights</h3>
          </div>
          <div className="text-sm opacity-70">
            {quantumField.resonance > 0.7 
              ? "High collective resonance detected! Perfect time for collaborative creation."
              : "Building quantum coherence... Keep collaborating!"}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
