import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTrendingUp, FaBrain, FaNetworkWired, FaLightbulb,
  FaChartLine, FaComments, FaHeart 
} from 'react-icons/fa';
import { useWebSocket } from '@/hooks/useWebSocket';
import ForceGraph2D from 'react-force-graph-2d';

interface SocialTrendsProps {
  communityId: string;
  features: {
    aiModeling: boolean;
    realTime: boolean;
    visualization: {
      network: boolean;
      timeline: boolean;
    };
  };
}

interface TrendData {
  topics: {
    id: string;
    name: string;
    volume: number;
    growth: number;
    sentiment: number;
    engagement: number;
    related: string[];
    timeline: {
      timestamp: string;
      volume: number;
      sentiment: number;
      engagement: number;
    }[];
  }[];
  relationships: {
    nodes: Array<{
      id: string;
      name: string;
      volume: number;
      cluster: string;
    }>;
    links: Array<{
      source: string;
      target: string;
      strength: number;
      type: 'related' | 'emerging' | 'evolving';
    }>;
  };
  insights: {
    emerging: string[];
    declining: string[];
    potential: string[];
    anomalies: {
      topic: string;
      type: 'surge' | 'drop' | 'shift';
      significance: number;
    }[];
  };
}

export const SocialTrends: React.FC<SocialTrendsProps> = ({
  communityId,
  features
}) => {
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const graphRef = React.useRef();
  const socket = useWebSocket(`/api/communities/${communityId}/trends`);

  useEffect(() => {
    if (socket && features.realTime) {
      socket.on('trendUpdate', (data: TrendData) => {
        setTrendData(data);
        if (graphRef.current) {
          graphRef.current.refresh();
        }
      });
    }
  }, [socket, features.realTime]);

  return (
    <motion.div 
      className="social-trends grid grid-cols-2 gap-6 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Trend Overview */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <FaTrendingUp className="mr-2" /> Trending Topics
          </h3>
          {features.aiModeling && (
            <div className="flex items-center text-sm text-purple-600">
              <FaBrain className="mr-1" /> AI Analysis Active
            </div>
          )}
        </div>

        <div className="space-y-4">
          {trendData?.topics.map(topic => (
            <motion.div
              key={topic.id}
              className={`p-4 rounded-lg border-2 cursor-pointer ${
                selectedTopic === topic.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedTopic(topic.id)}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{topic.name}</span>
                <span className={`text-sm ${
                  topic.growth > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {topic.growth > 0 ? '+' : ''}{topic.growth}%
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="flex items-center">
                  <FaComments className="mr-1 text-blue-500" />
                  {topic.volume}
                </div>
                <div className="flex items-center">
                  <FaHeart className="mr-1 text-red-500" />
                  {topic.engagement}%
                </div>
                <div className="flex items-center">
                  <FaLightbulb className="mr-1 text-yellow-500" />
                  {topic.sentiment > 0 ? '+' : ''}{topic.sentiment}
                </div>
              </div>

              {features.visualization.timeline && selectedTopic === topic.id && (
                <motion.div 
                  className="mt-4 h-32 bg-gray-50 rounded"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 128 }}
                >
                  {/* Add your preferred timeline visualization here */}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Topic Network */}
      {features.visualization.network && (
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold flex items-center mb-4">
            <FaNetworkWired className="mr-2" /> Topic Network
          </h3>
          
          <div className="h-[500px] bg-gray-50 rounded">
            <ForceGraph2D
              ref={graphRef}
              graphData={trendData?.relationships}
              nodeAutoColorBy="cluster"
              nodeRelSize={node => 6 + Math.sqrt(node.volume)}
              linkWidth={link => link.strength * 2}
              linkColor={link => {
                switch(link.type) {
                  case "emerging": return "#10B981";
                  case "evolving": return "#6366F1";
                  default: return "#6B7280";
                }
              }}
              nodeCanvasObject={(node, ctx, globalScale) => {
                const size = 6 + Math.sqrt(node.volume);
                
                // Base glow
                ctx.beginPath();
                ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
                ctx.fillStyle = node.color;
                ctx.fill();

                // Highlight selected topic
                if (selectedTopic === node.id) {
                  ctx.beginPath();
                  ctx.arc(node.x, node.y, size * 1.2, 0, 2 * Math.PI);
                  ctx.strokeStyle = "#3B82F6";
                  ctx.lineWidth = 2;
                  ctx.stroke();
                }
              }}
              onNodeClick={node => setSelectedTopic(node.id)}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};
