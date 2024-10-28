import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaHandsHelping, FaChartLine, FaClock } from 'react-icons/fa';

interface EngagementMetricsProps {
  participation: {
    active: number;
    total: number;
    retention: number;
    frequency: {
      daily: number;
      weekly: number;
      monthly: number;
    };
  };
  interaction: {
    responses: number;
    discussions: number;
    collaborations: number;
    timeSpent: number;
  };
  support: boolean;
}

export const EngagementMetrics: React.FC<EngagementMetricsProps> = ({
  participation,
  interaction,
  support
}) => {
  return (
    <motion.div 
      className="engagement-metrics bg-white rounded-lg shadow-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <FaUsers className="mr-2" /> Engagement Metrics
        </h3>
      </div>

      {/* Participation Overview */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-blue-50 rounded">
          <div className="text-sm text-blue-600 mb-1">Active Participants</div>
          <div className="text-2xl font-bold">
            {participation?.active}/{participation?.total}
          </div>
          <div className="text-sm text-blue-500 mt-1">
            {participation?.retention}% retention
          </div>
        </div>

        <div className="p-3 bg-green-50 rounded">
          <div className="text-sm text-green-600 mb-1">Interaction Rate</div>
          <div className="text-2xl font-bold">
            {Math.round((interaction?.responses / participation?.total) * 100)}%
          </div>
          <div className="text-sm text-green-500 mt-1">
            {interaction?.timeSpent}min avg time
          </div>
        </div>
      </div>

      {/* Frequency Breakdown */}
      <div className="p-3 bg-gray-50 rounded mb-4">
        <h4 className="text-sm font-medium flex items-center mb-2">
          <FaClock className="mr-1" /> Participation Frequency
        </h4>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <div className="text-gray-500">Daily</div>
            <div className="font-medium">{participation?.frequency.daily}%</div>
          </div>
          <div>
            <div className="text-gray-500">Weekly</div>
            <div className="font-medium">{participation?.frequency.weekly}%</div>
          </div>
          <div>
            <div className="text-gray-500">Monthly</div>
            <div className="font-medium">{participation?.frequency.monthly}%</div>
          </div>
        </div>
      </div>

      {/* Interaction Details */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium flex items-center mb-2">
          <FaHandsHelping className="mr-1" /> Community Activity
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-gray-50 rounded">
            <div className="text-sm text-gray-500">Discussions</div>
            <div className="font-medium">{interaction?.discussions}</div>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <div className="text-sm text-gray-500">Collaborations</div>
            <div className="font-medium">{interaction?.collaborations}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
