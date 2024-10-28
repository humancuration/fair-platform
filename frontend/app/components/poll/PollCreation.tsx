import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaVoteYea, FaLightbulb, FaUsers, FaGlobe, 
  FaBalanceScale, FaSeedling, FaHandshake 
} from 'react-icons/fa';

interface PollCreationProps {
  categories: Array<{
    id: string;
    name: string;
    icon: React.ReactNode;
    description: string;
  }>;
  onSubmit: (pollData: PollData) => void;
}

interface PollData {
  question: string;
  options: Array<{
    text: string;
    metadata?: {
      category?: string;
      impact?: {
        social: number;
        scientific: number;
        economic: number;
      };
      tags?: string[];
    };
  }>;
  settings: {
    duration: number;
    visibility: 'public' | 'private' | 'community';
    votingSystem: 'single' | 'multiple' | 'quadratic' | 'ranked';
    allowDiscussion: boolean;
    requireJustification: boolean;
    communityFeatures: {
      enableNetworking: boolean;
      allowCollaboration: boolean;
      trackImpact: boolean;
    };
  };
  metadata: {
    purpose: 'research' | 'social' | 'product' | 'governance';
    expectedParticipants: number;
    relevantCommunities: string[];
    potentialImpact: {
      sdgs?: string[];
      communities?: string[];
      scientific?: number;
      social?: number;
    };
  };
}

export const PollCreation: React.FC<PollCreationProps> = ({
  categories,
  onSubmit
}) => {
  const [pollData, setPollData] = useState<PollData>({
    question: '',
    options: [{ text: '' }, { text: '' }],
    settings: {
      duration: 7,
      visibility: 'public',
      votingSystem: 'single',
      allowDiscussion: true,
      requireJustification: false,
      communityFeatures: {
        enableNetworking: true,
        allowCollaboration: true,
        trackImpact: true
      }
    },
    metadata: {
      purpose: 'social',
      expectedParticipants: 100,
      relevantCommunities: [],
      potentialImpact: {}
    }
  });

  const addOption = () => {
    setPollData(prev => ({
      ...prev,
      options: [...prev.options, { text: '' }]
    }));
  };

  return (
    <motion.div 
      className="poll-creation bg-white rounded-lg shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <FaVoteYea className="mr-2" /> Create Poll
      </h2>

      {/* Question Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Question</label>
        <input
          type="text"
          className="w-full p-3 border rounded"
          value={pollData.question}
          onChange={e => setPollData(prev => ({
            ...prev,
            question: e.target.value
          }))}
          placeholder="What would you like to ask?"
        />
      </div>

      {/* Options */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Options</label>
        <div className="space-y-3">
          {pollData.options.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-2"
            >
              <input
                type="text"
                className="flex-1 p-3 border rounded"
                value={option.text}
                onChange={e => {
                  const newOptions = [...pollData.options];
                  newOptions[index].text = e.target.value;
                  setPollData(prev => ({ ...prev, options: newOptions }));
                }}
                placeholder={`Option ${index + 1}`}
              />
            </motion.div>
          ))}
          <button
            onClick={addOption}
            className="text-blue-500 text-sm flex items-center"
          >
            <FaLightbulb className="mr-1" /> Add Option
          </button>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            <FaUsers className="inline mr-1" /> Voting System
          </label>
          <select
            className="w-full p-3 border rounded"
            value={pollData.settings.votingSystem}
            onChange={e => setPollData(prev => ({
              ...prev,
              settings: { ...prev.settings, votingSystem: e.target.value as any }
            }))}
          >
            <option value="single">Single Choice</option>
            <option value="multiple">Multiple Choice</option>
            <option value="quadratic">Quadratic Voting</option>
            <option value="ranked">Ranked Choice</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            <FaGlobe className="inline mr-1" /> Purpose
          </label>
          <select
            className="w-full p-3 border rounded"
            value={pollData.metadata.purpose}
            onChange={e => setPollData(prev => ({
              ...prev,
              metadata: { ...prev.metadata, purpose: e.target.value as any }
            }))}
          >
            <option value="social">Social</option>
            <option value="research">Research</option>
            <option value="product">Product</option>
            <option value="governance">Governance</option>
          </select>
        </div>
      </div>

      {/* Community Features */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <FaHandshake className="mr-1" /> Community Features
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(pollData.settings.communityFeatures).map(([key, value]) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={value}
                onChange={e => setPollData(prev => ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    communityFeatures: {
                      ...prev.settings.communityFeatures,
                      [key]: e.target.checked
                    }
                  }
                }))}
              />
              <span className="text-sm">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => onSubmit(pollData)}
        className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
      >
        Create Poll
      </button>
    </motion.div>
  );
};
