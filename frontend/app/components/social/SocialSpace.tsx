import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaPoll, FaNetworkWired, FaLightbulb } from 'react-icons/fa';

interface SocialConnection {
  id: string;
  participants: string[];
  type: 'discussion' | 'poll' | 'collaboration';
  strength: number;
  startTime: number;
  sharedContext?: {
    topics: string[];
    sentiment: string;
    interactions: number[];
    insights: string[];
  };
}

interface SocialSpaceProps {
  polls: Array<{
    id: string;
    question: string;
    options: Array<{
      id: string;
      text: string;
      votes: number;
    }>;
    participants: string[];
    connections: SocialConnection[];
  }>;
  onVote: (pollId: string, optionId: string) => void;
  onConnect: (connection: SocialConnection) => void;
}

export const SocialSpace: React.FC<SocialSpaceProps> = ({
  polls,
  onVote,
  onConnect
}) => {
  const [activeConnections, setActiveConnections] = useState<SocialConnection[]>([]);
  const [selectedPoll, setSelectedPoll] = useState<string | null>(null);

  const createConnection = (pollId: string, type: SocialConnection['type']) => {
    const connection: SocialConnection = {
      id: `social-${Math.random()}`,
      participants: polls.find(p => p.id === pollId)?.participants || [],
      type,
      strength: Math.random(),
      startTime: Date.now(),
      sharedContext: {
        topics: [],
        sentiment: 'neutral',
        interactions: [],
        insights: []
      }
    };

    setActiveConnections(prev => [...prev, connection]);
    onConnect(connection);
  };

  return (
    <motion.div 
      className="social-space bg-white rounded-lg shadow-lg p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="grid grid-cols-2 gap-6">
        {/* Active Polls */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center">
            <FaPoll className="mr-2" /> Active Polls
          </h3>
          {polls.map(poll => (
            <motion.div
              key={poll.id}
              className={`p-4 rounded-lg border-2 ${
                selectedPoll === poll.id ? 'border-blue-500' : 'border-gray-200'
              }`}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedPoll(poll.id)}
            >
              <h4 className="font-medium mb-3">{poll.question}</h4>
              <div className="space-y-2">
                {poll.options.map(option => (
                  <button
                    key={option.id}
                    className="w-full p-2 bg-gray-50 rounded hover:bg-gray-100"
                    onClick={() => onVote(poll.id, option.id)}
                  >
                    {option.text} ({option.votes} votes)
                  </button>
                ))}
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  className="text-blue-500 text-sm"
                  onClick={() => createConnection(poll.id, 'discussion')}
                >
                  <FaNetworkWired className="inline mr-1" />
                  Connect
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Active Connections */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center">
            <FaUsers className="mr-2" /> Active Connections
          </h3>
          <div className="space-y-3">
            {activeConnections.map(connection => (
              <motion.div
                key={connection.id}
                className="p-3 bg-gray-50 rounded"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {connection.type.charAt(0).toUpperCase() + connection.type.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {connection.participants.length} participants
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Strength: {(connection.strength * 100).toFixed(1)}%
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
