import React, { useRef } from 'react';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { motion } from 'framer-motion';
import { 
  FaChartLine, FaBrain, FaUsers, FaLightbulb,
  FaComments, FaHeart, FaNetworkWired, FaGlobe 
} from 'react-icons/fa';
import type { NetworkNode, NetworkLink } from '~/types/network';
import { NetworkGraph } from '~/components/visualization/NetworkGraph';

interface SocialAnalyticsProps {
  communityId: string;
  features: {
    realTime: boolean;
    aiAssisted: boolean;
    sentiment: boolean;
    networking: boolean;
  };
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const metrics = await getCollectiveMetrics(params.communityId);
  return json({ metrics });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const nodeId = formData.get('nodeId');
  
  if (nodeId) {
    await updateNodeActivity(nodeId as string);
    return json({ success: true });
  }
  
  return json({ success: false });
};

export const SocialAnalytics: React.FC<SocialAnalyticsProps> = ({
  communityId,
  features
}) => {
  const { metrics } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [selectedTopic, setSelectedTopic] = React.useState<string | null>(null);

  const handleNodeClick = (nodeId: string) => {
    if (features.networking) {
      fetcher.submit(
        { nodeId },
        { method: 'post' }
      );
    }
  };

  return (
    <motion.div 
      className="social-analytics grid grid-cols-1 md:grid-cols-2 gap-6 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Collective Impact */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold flex items-center mb-4">
          <FaGlobe className="mr-2 text-green-500" />
          Collective Impact
        </h3>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {metrics?.learning.impactMetrics && (
            <>
              <div className="text-center p-4 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">
                  {metrics.learning.impactMetrics.peopleReached}
                </div>
                <div className="text-sm text-gray-600">People Reached</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">
                  {metrics.learning.impactMetrics.communitiesSupported}
                </div>
                <div className="text-sm text-gray-600">Communities Supported</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded">
                <div className="text-2xl font-bold text-purple-600">
                  {metrics.learning.impactMetrics.projectsLaunched}
                </div>
                <div className="text-sm text-gray-600">Projects Launched</div>
              </div>
            </>
          )}
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
          <NetworkGraph
            nodes={metrics?.interactions.connections.nodes}
            edges={metrics?.interactions.connections.links}
            onNodeClick={handleNodeClick}
            selectedNode={selectedTopic}
            config={{
              nodeSize: (node) => 6 + node.influence * 2,
              nodeColor: (node) => node.group,
              edgeWidth: (edge) => edge.strength,
              edgeColor: (edge) => {
                switch(edge.type) {
                  case "collaboration": return "#4f46e5";
                  case "comment": return "#059669";
                  case "reaction": return "#dc2626";
                  case "share": return "#eab308";
                  default: return "#6b7280";
                }
              }
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};
