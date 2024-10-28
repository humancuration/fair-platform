import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaClock, FaChartLine } from 'react-icons/fa';

interface ParticipantEngagementProps {
  metrics: {
    activeParticipants: number;
    averageResponseTime: number;
    completionRate: number;
    engagementScore: number;
    trends: {
      participation: number[];
      timeSpent: number[];
      quality: number[];
    };
  };
  trends: {
    hourly: any[];
    daily: any[];
    weekly: any[];
  };
}

export const ParticipantEngagement: React.FC<ParticipantEngagementProps> = ({
  metrics,
  trends
}) => {
  return (
    <motion.div 
      className="participant-engagement bg-white rounded-lg shadow-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <FaUsers className="mr-2" /> Participant Engagement
        </h3>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-blue-50 rounded">
          <div className="text-sm text-blue-600 mb-1">Active Participants</div>
          <div className="text-2xl font-bold">
            {metrics?.activeParticipants}
          </div>
        </div>
        
        <div className="p-3 bg-green-50 rounded">
          <div className="text-sm text-green-600 mb-1">Completion Rate</div>
          <div className="text-2xl font-bold">
            {metrics?.completionRate}%
          </div>
        </div>
      </div>

      {/* Engagement Trends */}
      <div className="space-y-4">
        <div className="p-3 bg-gray-50 rounded">
          <h4 className="text-sm font-medium flex items-center mb-2">
            <FaChartLine className="mr-1" /> Engagement Trends
          </h4>
          <div className="h-32">
            {/* Add your preferred charting library component here */}
          </div>
        </div>

        {/* Response Time Analysis */}
        <div className="p-3 bg-gray-50 rounded">
          <h4 className="text-sm font-medium flex items-center mb-2">
            <FaClock className="mr-1" /> Response Time
          </h4>
          <div className="text-sm">
            <div className="flex justify-between mb-1">
              <span>Average Response Time:</span>
              <span>{metrics?.averageResponseTime}s</span>
            </div>
            <div className="flex justify-between">
              <span>Engagement Score:</span>
              <span>{metrics?.engagementScore}/10</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
