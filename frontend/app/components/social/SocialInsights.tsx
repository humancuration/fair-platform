import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBrain, FaLightbulb, FaChartLine, FaNetworkWired,
  FaTrendingUp, FaUsers, FaComments 
} from 'react-icons/fa';
import { useWebSocket } from '@/hooks/useWebSocket';

interface SocialInsightsProps {
  communityId: string;
  features: {
    aiAssistance: {
      sentimentTracking: boolean;
      topicModeling: boolean;
      participantSupport: boolean;
    };
    visualization: {
      interactiveElements: boolean;
      realTimeNetworks: boolean;
    };
  };
}

interface Insight {
  id: string;
  type: 'trend' | 'anomaly' | 'opportunity' | 'risk';
  title: string;
  description: string;
  confidence: number;
  impact: number;
  relatedTopics: string[];
  recommendations: string[];
  metadata: {
    timestamp: number;
    source: 'ai' | 'human';
    priority: number;
    status: 'active' | 'resolved' | 'monitoring';
  };
}

export const SocialInsights: React.FC<SocialInsightsProps> = ({
  communityId,
  features
}) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const socket = useWebSocket(`/api/communities/${communityId}/insights`);

  useEffect(() => {
    if (socket && features.aiAssistance.sentimentTracking) {
      socket.on('newInsight', (insight: Insight) => {
        setInsights(prev => [insight, ...prev]);
      });

      socket.on('insightUpdate', (updatedInsight: Insight) => {
        setInsights(prev => prev.map(insight => 
          insight.id === updatedInsight.id ? updatedInsight : insight
        ));
      });
    }
  }, [socket, features.aiAssistance.sentimentTracking]);

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'trend': return <FaTrendingUp className="text-blue-500" />;
      case 'anomaly': return <FaChartLine className="text-red-500" />;
      case 'opportunity': return <FaLightbulb className="text-green-500" />;
      case 'risk': return <FaNetworkWired className="text-yellow-500" />;
    }
  };

  return (
    <motion.div 
      className="social-insights grid grid-cols-2 gap-6 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* AI Insights Panel */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <FaBrain className="mr-2 text-purple-500" /> AI Insights
          </h3>
          {features.aiAssistance.topicModeling && (
            <span className="text-sm text-purple-600">
              Topic Modeling Active
            </span>
          )}
        </div>

        <div className="space-y-4">
          {insights.map(insight => (
            <motion.div
              key={insight.id}
              className={`p-4 rounded-lg border-2 cursor-pointer ${
                selectedInsight === insight.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
              }`}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedInsight(insight.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {getInsightIcon(insight.type)}
                  <span className="ml-2 font-medium">{insight.title}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-500">
                    {insight.confidence * 100}% confidence
                  </span>
                  <span className={`px-2 py-1 rounded ${
                    insight.impact > 0.7 ? 'bg-red-100 text-red-700' :
                    insight.impact > 0.4 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    Impact: {insight.impact * 100}%
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">{insight.description}</p>

              {selectedInsight === insight.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3"
                >
                  <div className="flex flex-wrap gap-2">
                    {insight.relatedTopics.map(topic => (
                      <span key={topic} className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="border-t pt-3">
                    <h4 className="text-sm font-medium mb-2">Recommendations:</h4>
                    <ul className="space-y-2">
                      {insight.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <FaLightbulb className="mr-2 mt-1 text-yellow-500" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Visualization Panel */}
      {features.visualization.interactiveElements && (
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold flex items-center mb-4">
            <FaChartLine className="mr-2" /> Impact Visualization
          </h3>
          
          <div className="h-[600px] bg-gray-50 rounded">
            {/* Add your preferred visualization library here */}
          </div>
        </div>
      )}
    </motion.div>
  );
};
