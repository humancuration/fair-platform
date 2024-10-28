import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaComments, FaHeart, FaLightbulb } from 'react-icons/fa';

interface CommunityPulseProps {
  sentiment: {
    overall: number;
    trends: {
      positive: number;
      neutral: number;
      negative: number;
    };
    topics: Record<string, number>;
  };
  topics: {
    name: string;
    volume: number;
    engagement: number;
    sentiment: number;
  }[];
  aiEnabled: boolean;
}

export const CommunityPulse: React.FC<CommunityPulseProps> = ({
  sentiment,
  topics,
  aiEnabled
}) => {
  return (
    <motion.div 
      className="community-pulse bg-white rounded-lg shadow-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <FaUsers className="mr-2" /> Community Pulse
        </h3>
      </div>

      {/* Overall Sentiment */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 bg-green-50 rounded">
          <div className="text-sm text-green-600 mb-1">Positive</div>
          <div className="text-xl font-bold">
            {sentiment?.trends.positive}%
          </div>
        </div>
        
        <div className="p-3 bg-gray-50 rounded">
          <div className="text-sm text-gray-600 mb-1">Neutral</div>
          <div className="text-xl font-bold">
            {sentiment?.trends.neutral}%
          </div>
        </div>

        <div className="p-3 bg-red-50 rounded">
          <div className="text-sm text-red-600 mb-1">Concerns</div>
          <div className="text-xl font-bold">
            {sentiment?.trends.negative}%
          </div>
        </div>
      </div>

      {/* Active Topics */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium flex items-center">
          <FaComments className="mr-1" /> Active Topics
        </h4>
        {topics?.map((topic, index) => (
          <motion.div 
            key={index}
            className="p-3 bg-gray-50 rounded"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{topic.name}</span>
              <span className="text-sm text-gray-500">
                {topic.volume} responses
              </span>
            </div>
            <div className="mt-2 flex items-center space-x-4 text-sm">
              <span className="flex items-center">
                <FaHeart className="mr-1 text-red-500" />
                {topic.engagement}%
              </span>
              <span className="flex items-center">
                <FaLightbulb className="mr-1 text-yellow-500" />
                {topic.sentiment > 0 ? '+' : ''}{topic.sentiment}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sentiment Timeline */}
      <div className="mt-4 p-3 bg-gray-50 rounded">
        <h4 className="text-sm font-medium mb-2">Sentiment Timeline</h4>
        <div className="h-32">
          {/* Add your preferred charting library component here */}
        </div>
      </div>
    </motion.div>
  );
};
