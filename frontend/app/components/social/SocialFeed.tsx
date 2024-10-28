import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHeart, FaComment, FaShare, FaLightbulb,
  FaChartLine, FaNetworkWired, FaBrain 
} from 'react-icons/fa';
import { useWebSocket } from '@/hooks/useWebSocket';

interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    influence: number;
  };
  content: string;
  timestamp: number;
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    sentiment: number;
    engagement: number;
  };
  topics: string[];
  aiInsights?: {
    sentiment: 'positive' | 'neutral' | 'negative';
    topics: string[];
    suggestedConnections: string[];
    emergingTrends: string[];
  };
}

interface SocialFeedProps {
  communityId: string;
  features: {
    aiAssistance: boolean;
    realTimeMetrics: boolean;
    networkVisualization: boolean;
  };
}

export const SocialFeed: React.FC<SocialFeedProps> = ({
  communityId,
  features
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const socket = useWebSocket(`/api/communities/${communityId}/feed`);

  useEffect(() => {
    if (socket && features.realTimeMetrics) {
      socket.on('newPost', (post: Post) => {
        setPosts(prev => [post, ...prev]);
      });

      socket.on('postUpdate', (updatedPost: Post) => {
        setPosts(prev => prev.map(post => 
          post.id === updatedPost.id ? updatedPost : post
        ));
      });
    }
  }, [socket, features.realTimeMetrics]);

  return (
    <motion.div className="social-feed space-y-6">
      {posts.map(post => (
        <motion.div
          key={post.id}
          className="bg-white rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
        >
          {/* Post Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img 
                src={post.author.avatar} 
                className="w-10 h-10 rounded-full"
                alt={post.author.name} 
              />
              <div>
                <div className="font-medium">{post.author.name}</div>
                <div className="text-sm text-gray-500">
                  {new Date(post.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
            
            {features.aiAssistance && post.aiInsights && (
              <div className="flex items-center space-x-2">
                <FaBrain className="text-purple-500" />
                <span className={`text-sm ${
                  post.aiInsights.sentiment === 'positive' ? 'text-green-500' :
                  post.aiInsights.sentiment === 'negative' ? 'text-red-500' :
                  'text-gray-500'
                }`}>
                  {post.aiInsights.sentiment}
                </span>
              </div>
            )}
          </div>

          {/* Post Content */}
          <div className="mb-4">
            <p className="text-gray-800">{post.content}</p>
            {post.topics.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {post.topics.map(topic => (
                  <span 
                    key={topic}
                    className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Engagement Metrics */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1 hover:text-red-500">
                <FaHeart />
                <span>{post.metrics.likes}</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-blue-500">
                <FaComment />
                <span>{post.metrics.comments}</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-green-500">
                <FaShare />
                <span>{post.metrics.shares}</span>
              </button>
            </div>
            
            {features.realTimeMetrics && (
              <div className="flex items-center space-x-3">
                <span className="flex items-center">
                  <FaChartLine className="mr-1" />
                  {post.metrics.engagement}%
                </span>
                <span className="flex items-center">
                  <FaLightbulb className="mr-1" />
                  {post.metrics.sentiment > 0 ? '+' : ''}{post.metrics.sentiment}
                </span>
              </div>
            )}
          </div>

          {/* AI Insights Panel */}
          {features.aiAssistance && post.aiInsights && selectedPost === post.id && (
            <motion.div
              className="mt-4 p-4 bg-purple-50 rounded-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <h4 className="font-medium flex items-center mb-2">
                <FaBrain className="mr-2" /> AI Insights
              </h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium">Emerging Trends:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {post.aiInsights.emergingTrends.map(trend => (
                      <span 
                        key={trend}
                        className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-sm"
                      >
                        {trend}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">Suggested Connections:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {post.aiInsights.suggestedConnections.map(connection => (
                      <span 
                        key={connection}
                        className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                      >
                        {connection}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};
