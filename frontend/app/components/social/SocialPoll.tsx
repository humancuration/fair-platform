import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaNetworkWired, FaChartBar, FaPoll, FaUsers } from 'react-icons/fa';
import { NetworkGraph } from '../visualization/NetworkGraph';

interface SocialPollProps {
  pollData: {
    id: string;
    question: string;
    options: {
      id: string;
      text: string;
      votes: number;
      voters: string[];
    }[];
    semanticLinks: {
      target: string;
      relationship: string;
      confidence: number;
    }[];
    engagement: {
      totalVotes: number;
      activeDiscussions: number;
      sharedCount: number;
    };
  };
  onVote: (optionId: string) => void;
  onShare: () => void;
}

export const SocialPoll: React.FC<SocialPollProps> = ({
  pollData,
  onVote,
  onShare
}) => {
  const [showSemanticLinks, setShowSemanticLinks] = useState(false);
  const totalVotes = pollData.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <motion.div 
      className="social-poll bg-white rounded-lg shadow-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-lg font-semibold mb-4">{pollData.question}</h3>

      {/* Poll Options */}
      <div className="space-y-3 mb-6">
        {pollData.options.map(option => {
          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
          
          return (
            <motion.button
              key={option.id}
              className="w-full p-3 bg-gray-50 rounded hover:bg-gray-100"
              whileHover={{ scale: 1.02 }}
              onClick={() => onVote(option.id)}
            >
              <div className="flex justify-between mb-1">
                <span>{option.text}</span>
                <span className="text-gray-500">{percentage.toFixed(1)}%</span>
              </div>
              <div className="relative h-2 bg-gray-200 rounded">
                <motion.div
                  className="absolute h-full bg-blue-500 rounded"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
        <div className="p-2 bg-blue-50 rounded text-center">
          <div className="text-blue-600 font-medium">{pollData.engagement.totalVotes}</div>
          <div className="text-gray-500">Votes</div>
        </div>
        <div className="p-2 bg-green-50 rounded text-center">
          <div className="text-green-600 font-medium">{pollData.engagement.activeDiscussions}</div>
          <div className="text-gray-500">Discussions</div>
        </div>
        <div className="p-2 bg-purple-50 rounded text-center">
          <div className="text-purple-600 font-medium">{pollData.engagement.sharedCount}</div>
          <div className="text-gray-500">Shares</div>
        </div>
      </div>

      {/* Semantic Network */}
      <div className="border-t pt-4">
        <button
          onClick={() => setShowSemanticLinks(!showSemanticLinks)}
          className="text-blue-500 text-sm flex items-center gap-1"
        >
          <FaNetworkWired className="mr-1" />
          View Related Topics
        </button>
        
        <AnimatePresence>
          {showSemanticLinks && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 300 }}
              exit={{ height: 0 }}
              className="mt-2 border rounded-lg overflow-hidden"
            >
              <NetworkGraph
                nodes={[
                  { id: pollData.id, label: 'Current Poll' },
                  ...pollData.semanticLinks.map(link => ({
                    id: link.target,
                    label: link.relationship
                  }))
                ]}
                edges={pollData.semanticLinks.map(link => ({
                  from: pollData.id,
                  to: link.target,
                  label: link.relationship,
                  width: link.confidence * 5
                }))}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
