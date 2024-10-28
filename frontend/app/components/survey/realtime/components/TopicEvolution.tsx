import React from 'react';
import { motion } from 'framer-motion';
import { FaComments, FaTrendingUp, FaBrain, FaNetworkWired } from 'react-icons/fa';

interface TopicEvolutionProps {
  topics: {
    id: string;
    name: string;
    volume: number;
    growth: number;
    related: string[];
    sentiment: number;
    timeline: {
      timestamp: string;
      volume: number;
      sentiment: number;
    }[];
  }[];
  trends: {
    emerging: string[];
    declining: string[];
    stable: string[];
    relationships: Record<string, string[]>;
  };
  modeling: boolean;
}

export const TopicEvolution: React.FC<TopicEvolutionProps> = ({
  topics,
  trends,
  modeling
}) => {
  return (
    <motion.div 
      className="topic-evolution bg-white rounded-lg shadow-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <FaTrendingUp className="mr-2" /> Topic Evolution
        </h3>
        {modeling && (
          <div className="flex items-center text-sm text-purple-600">
            <FaBrain className="mr-1" /> AI Modeling Active
          </div>
        )}
      </div>

      {/* Emerging Topics */}
      <div className="mb-4">
        <h4 className="text-sm font-medium flex items-center mb-2">
          <FaComments className="mr-1" /> Emerging Topics
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {trends?.emerging.map((topic, index) => (
            <motion.div
              key={index}
              className="p-2 bg-purple-50 rounded text-sm"
              whileHover={{ scale: 1.02 }}
            >
              {topic}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Topic Relationships */}
      <div className="p-3 bg-gray-50 rounded mb-4">
        <h4 className="text-sm font-medium flex items-center mb-2">
          <FaNetworkWired className="mr-1" /> Topic Relationships
        </h4>
        <div className="h-40">
          {/* Add your preferred network visualization library here */}
        </div>
      </div>

      {/* Topic Timeline */}
      <div className="space-y-3">
        {topics?.map((topic, index) => (
          <motion.div
            key={topic.id}
            className="p-3 bg-gray-50 rounded"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{topic.name}</span>
              <span className={`text-sm ${topic.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {topic.growth > 0 ? '+' : ''}{topic.growth}%
              </span>
            </div>
            <div className="h-20">
              {/* Add your preferred timeline visualization library here */}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
