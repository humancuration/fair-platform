import React, { useState } from 'react';
import { useLoaderData } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTrendingUp, FaBrain, FaNetworkWired, FaLightbulb,
  FaChartLine, FaComments, FaHeart, FaGraduationCap, FaUsers 
} from 'react-icons/fa';
import { NetworkGraph } from '../visualization/NetworkGraph';

interface TrendNode {
  id: string;
  name: string;
  volume: number;
  cluster: string;
}

interface TrendLink {
  source: string;
  target: string;
  strength: number;
  type: 'related' | 'emerging' | 'evolving';
}

interface TrendTopic {
  id: string;
  name: string;
  volume: number;
  growth: number;
  sentiment: number;
  engagement: number;
  related: string[];
  timeline: Array<{
    timestamp: string;
    volume: number;
    sentiment: number;
    engagement: number;
  }>;
}

interface TrendInsight {
  topic: string;
  type: 'surge' | 'drop' | 'shift';
  significance: number;
}

interface TrendData {
  topics: TrendTopic[];
  relationships: {
    nodes: TrendNode[];
    links: TrendLink[];
  };
  insights: {
    emerging: string[];
    declining: string[];
    potential: string[];
    anomalies: TrendInsight[];
  };
  learningMetrics: {
    topSkills: Array<{
      name: string;
      demand: number;
      growth: number;
      resources: number;
    }>;
    collaborativeProjects: Array<{
      name: string;
      participants: number;
      impact: number;
      status: 'active' | 'completed' | 'planned';
    }>;
    communityGrowth: {
      newMembers: number;
      activeMentors: number;
      resourceContributions: number;
      crossPollination: number;
    };
  };
}

interface SocialTrendsProps {
  features: {
    aiModeling: boolean;
    realTime: boolean;
    visualization: {
      network: boolean;
      timeline: boolean;
    };
  };
}

export const SocialTrends: React.FC<SocialTrendsProps> = ({ features }) => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const { trendData } = useLoaderData<{ trendData: TrendData }>();

  return (
    <motion.div 
      className="social-trends grid grid-cols-1 md:grid-cols-2 gap-6 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Learning & Growth Trends */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <FaGraduationCap className="mr-2 text-blue-500" /> Learning Trends
          </h3>
          {features.aiModeling && (
            <div className="flex items-center text-sm text-purple-600">
              <FaBrain className="mr-1" /> AI Analysis Active
            </div>
          )}
        </div>

        <div className="space-y-4">
          {trendData.learningMetrics.topSkills.map(skill => (
            <motion.div
              key={skill.name}
              className={`p-4 rounded-lg border-2 ${
                selectedTopic === skill.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedTopic(skill.name)}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{skill.name}</span>
                <span className={`text-sm ${
                  skill.growth > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {skill.growth > 0 ? '+' : ''}{skill.growth}%
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center">
                  <FaUsers className="mr-1 text-blue-500" />
                  Demand: {skill.demand}
                </div>
                <div className="flex items-center">
                  <FaLightbulb className="mr-1 text-yellow-500" />
                  Resources: {skill.resources}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Community Growth & Impact */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold flex items-center mb-4">
          <FaChartLine className="mr-2 text-green-500" /> Community Impact
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">
              {trendData.learningMetrics.communityGrowth.newMembers}
            </div>
            <div className="text-sm text-gray-600">New Members</div>
          </div>
          <div className="p-4 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">
              {trendData.learningMetrics.communityGrowth.activeMentors}
            </div>
            <div className="text-sm text-gray-600">Active Mentors</div>
          </div>
          <div className="p-4 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">
              {trendData.learningMetrics.communityGrowth.resourceContributions}
            </div>
            <div className="text-sm text-gray-600">Resources Shared</div>
          </div>
          <div className="p-4 bg-yellow-50 rounded">
            <div className="text-2xl font-bold text-yellow-600">
              {trendData.learningMetrics.communityGrowth.crossPollination}
            </div>
            <div className="text-sm text-gray-600">Cross-Community Collaborations</div>
          </div>
        </div>

        {features.visualization.network && (
          <div className="h-[300px] bg-gray-50 rounded">
            <NetworkGraph
              nodes={trendData.relationships.nodes}
              edges={trendData.relationships.links.map(link => ({
                from: link.source,
                to: link.target,
                width: link.strength * 2,
                color: link.type === 'emerging' ? '#10B981' : 
                       link.type === 'evolving' ? '#6366F1' : '#6B7280'
              }))}
              onNodeClick={(node) => setSelectedTopic(node.id)}
              selectedNode={selectedTopic}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};
