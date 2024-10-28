import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaChartLine, FaBrain, FaUsers, FaLightbulb,
  FaComments, FaHeart, FaNetworkWired 
} from 'react-icons/fa';
import ForceGraph2D from 'react-force-graph-2d';
import { useWebSocket } from '@/hooks/useWebSocket';

interface SocialAnalyticsProps {
  communityId: string;
  features: {
    realTime: boolean;
    aiAssisted: boolean;
    sentiment: boolean;
    networking: boolean;
  };
}

interface SocialMetrics {
  posts: {
    total: number;
    trending: { id: string; title: string; engagement: number }[];
    sentiment: { positive: number; neutral: number; negative: number };
  };
  interactions: {
    comments: number;
    reactions: number;
    shares: number;
    connections: {
      nodes: Array<{
        id: string;
        name: string;
        influence: number;
        activity: number;
        group: string;
      }>;
      links: Array<{
        source: string;
        target: string;
        strength: number;
        type: 'comment' | 'reaction' | 'share' | 'collaboration';
      }>;
    };
  };
  topics: Array<{
    name: string;
    volume: number;
    sentiment: number;
    trend: 'rising' | 'stable' | 'falling';
  }>;
}

export const SocialAnalytics: React.FC<SocialAnalyticsProps> = ({
  communityId,
  features
}) => {
  const graphRef = useRef();
  const [metrics, setMetrics] = useState<SocialMetrics | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  const socket = useWebSocket(`/api/communities/${communityId}/analytics`);

  useEffect(() => {
    if (socket && features.realTime) {
      socket.on('metrics', (data: SocialMetrics) => {
        setMetrics(data);
        
        // Update network visualization
        if (graphRef.current) {
          graphRef.current.refresh();
        }
      });
    }
  }, [socket, features.realTime]);

  return (
    <motion.div 
      className="social-analytics grid grid-cols-2 gap-6 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Community Pulse */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold flex items-center mb-4">
          <FaHeart className="mr-2 text-red-500" /> Community Pulse
        </h3>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          {metrics?.posts.sentiment && Object.entries(metrics.posts.sentiment).map(([type, value]) => (
            <div key={type} className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold">{(value * 100).toFixed(1)}%</div>
              <div className="text-sm text-gray-500 capitalize">{type}</div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {metrics?.topics.map(topic => (
            <motion.div
              key={topic.name}
              className={`p-3 rounded cursor-pointer ${
                selectedTopic === topic.name ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
              }`}
              onClick={() => setSelectedTopic(topic.name)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{topic.name}</span>
                <span className={`text-sm ${
                  topic.trend === 'rising' ? 'text-green-500' : 
                  topic.trend === 'falling' ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {topic.trend}
                </span>
              </div>
              <div className="mt-2 flex items-center space-x-4 text-sm">
                <span>Volume: {topic.volume}</span>
                <span>Sentiment: {topic.sentiment > 0 ? '+' : ''}{topic.sentiment}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interaction Network */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold flex items-center mb-4">
          <FaNetworkWired className="mr-2" /> Interaction Network
        </h3>
        
        <div className="h-[500px] bg-gray-50 rounded">
          <ForceGraph2D
            ref={graphRef}
            graphData={metrics?.interactions.connections}
            nodeAutoColorBy="group"
            nodeRelSize={node => 6 + node.influence * 2}
            linkWidth={link => link.strength}
            linkColor={link => {
              switch(link.type) {
                case "collaboration": return "#4f46e5";
                case "comment": return "#059669";
                case "reaction": return "#dc2626";
                case "share": return "#eab308";
                default: return "#6b7280";
              }
            }}
            nodeCanvasObject={(node, ctx, globalScale) => {
              // Quantum-inspired node visualization
              const size = 6 + node.influence * 2;
              
              // Base glow
              ctx.beginPath();
              ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
              ctx.fillStyle = node.color;
              ctx.fill();

              // Activity ripple
              if (node.activity > 0.5) {
                ctx.beginPath();
                ctx.arc(node.x, node.y, size * (1 + node.activity), 0, 2 * Math.PI);
                ctx.strokeStyle = `${node.color}44`;
                ctx.stroke();
              }
            }}
            onNodeClick={node => {
              if (features.networking) {
                node.activity = 1;
                setTimeout(() => {
                  node.activity = 0;
                  graphRef.current?.refresh();
                }, 1000);
              }
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};
