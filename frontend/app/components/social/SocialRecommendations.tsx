import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaLightbulb, FaBrain, FaUsers, FaHeart,
  FaComments, FaChartLine, FaNetworkWired 
} from 'react-icons/fa';
import { useWebSocket } from '@/hooks/useWebSocket';

interface SocialRecommendationsProps {
  communityId: string;
  features: {
    aiAssistance: {
      sentimentTracking: boolean;
      topicModeling: boolean;
      participantSupport: boolean;
    };
    realTime: boolean;
  };
}

interface Recommendation {
  id: string;
  type: 'engagement' | 'content' | 'community' | 'moderation';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact: {
    sentiment: number;
    engagement: number;
    growth: number;
  };
  steps: string[];
  metrics: {
    effort: number;
    timeframe: string;
    confidence: number;
  };
  aiGenerated: boolean;
  relatedTopics: string[];
}

export const SocialRecommendations: React.FC<SocialRecommendationsProps> = ({
  communityId,
  features
}) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedRec, setSelectedRec] = useState<string | null>(null);
  const [filter, setFilter] = useState<Recommendation['type'] | 'all'>('all');
  
  const socket = useWebSocket(`/api/communities/${communityId}/recommendations`);

  useEffect(() => {
    if (socket && features.realTime) {
      socket.on('newRecommendation', (rec: Recommendation) => {
        setRecommendations(prev => [rec, ...prev]);
      });
    }
  }, [socket, features.realTime]);

  const getPriorityColor = (priority: Recommendation['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50';
      case 'medium': return 'text-yellow-500 bg-yellow-50';
      case 'low': return 'text-green-500 bg-green-50';
    }
  };

  const getTypeIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'engagement': return <FaHeart className="text-red-500" />;
      case 'content': return <FaComments className="text-blue-500" />;
      case 'community': return <FaUsers className="text-green-500" />;
      case 'moderation': return <FaNetworkWired className="text-purple-500" />;
    }
  };

  return (
    <motion.div 
      className="social-recommendations grid grid-cols-2 gap-6 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Recommendations Panel */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <FaLightbulb className="mr-2 text-yellow-500" /> Recommendations
          </h3>
          {features.aiAssistance.sentimentTracking && (
            <div className="flex items-center text-sm text-purple-600">
              <FaBrain className="mr-1" /> AI-Powered
            </div>
          )}
        </div>

        {/* Type Filter */}
        <div className="flex space-x-2 mb-4">
          {['all', 'engagement', 'content', 'community', 'moderation'].map(type => (
            <button
              key={type}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === type 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setFilter(type as any)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {recommendations
            .filter(rec => filter === 'all' || rec.type === filter)
            .map(rec => (
            <motion.div
              key={rec.id}
              className={`p-4 rounded-lg border-2 cursor-pointer ${
                selectedRec === rec.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedRec(rec.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(rec.type)}
                  <span className="font-medium">{rec.title}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-sm ${getPriorityColor(rec.priority)}`}>
                  {rec.priority}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-3">{rec.description}</p>

              {selectedRec === rec.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4"
                >
                  {/* Impact Metrics */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-2 bg-blue-50 rounded text-center">
                      <div className="text-sm text-blue-600">Sentiment</div>
                      <div className="font-bold">
                        {rec.impact.sentiment > 0 ? '+' : ''}{rec.impact.sentiment}%
                      </div>
                    </div>
                    <div className="p-2 bg-green-50 rounded text-center">
                      <div className="text-sm text-green-600">Engagement</div>
                      <div className="font-bold">+{rec.impact.engagement}%</div>
                    </div>
                    <div className="p-2 bg-purple-50 rounded text-center">
                      <div className="text-sm text-purple-600">Growth</div>
                      <div className="font-bold">+{rec.impact.growth}%</div>
                    </div>
                  </div>

                  {/* Implementation Steps */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Implementation Steps:</h4>
                    <div className="space-y-2">
                      {rec.steps.map((step, index) => (
                        <div key={index} className="flex items-start space-x-2 text-sm">
                          <span className="font-medium">{index + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Related Topics */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Related Topics:</h4>
                    <div className="flex flex-wrap gap-2">
                      {rec.relatedTopics.map(topic => (
                        <span key={topic} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Metrics Impact Preview */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold flex items-center mb-4">
          <FaChartLine className="mr-2" /> Impact Preview
        </h3>
        
        <div className="h-[600px] bg-gray-50 rounded">
          {/* Add your preferred visualization library here */}
        </div>
      </div>
    </motion.div>
  );
};
