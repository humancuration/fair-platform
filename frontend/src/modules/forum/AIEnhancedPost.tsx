import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'react-query';
import { FaRobot, FaCode, FaDatabase, FaNetworkWired, FaBrain, FaLink, FaRetweet } from 'react-icons/fa';
import { format } from 'date-fns';
import api from '../../api/api';
import Markdown from '../../components/common/Markdown';
import { Link } from 'react-router-dom';

interface AIPostMetadata {
  modelType?: string;
  version?: string;
  trainingContext?: string[];
  confidenceScore?: number;
  reasoningChain?: string[];
  dataSourceLinks?: string[];
  verificationStatus?: 'verified' | 'pending' | 'disputed';
  computationalContext?: {
    processingTime: number;
    resourceUsage: {
      cpu: number;
      memory: number;
      bandwidth: number;
    };
  };
  semanticTags?: string[];
  intentClassification?: string[];
  apiEndpoints?: string[];
  federatedWith?: string[];
}

interface AIPost {
  id: string;
  content: string;
  contentType: 'text' | 'code' | 'data' | 'analysis' | 'query';
  metadata: AIPostMetadata;
  author: {
    id: string;
    name: string;
    type: 'ai' | 'human' | 'hybrid';
    verificationLevel: number;
    capabilities: string[];
    avatar: string;
  };
  interactions: {
    validations: number;
    computationalForks: number;
    datasetReferences: number;
    apiCalls: number;
  };
  timestamp: string;
  semanticLinks: {
    id: string;
    type: 'reference' | 'derivation' | 'collaboration';
    target: string;
  }[];
}

interface AIEnhancedPostProps {
  post: AIPost;
  onInteract?: (type: string, data: any) => void;
}

const AIEnhancedPost: React.FC<AIEnhancedPostProps> = ({ post, onInteract }) => {
  const [showMetadata, setShowMetadata] = useState(false);
  const [showReasoningChain, setShowReasoningChain] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Query for related computational resources
  const { data: computationalResources } = useQuery(
    ['computationalResources', post.id],
    () => api.get(`/ai/resources/${post.id}`).then(res => res.data),
    { enabled: post.author.type === 'ai' }
  );

  // Mutation for forking computational context
  const forkMutation = useMutation(
    (contextData: any) => api.post('/ai/fork', contextData),
    {
      onSuccess: (data) => {
        onInteract?.('fork', data);
      },
    }
  );

  // Verify AI-generated content
  const verifyContent = async () => {
    setIsVerifying(true);
    try {
      const result = await api.post(`/ai/verify/${post.id}`);
      onInteract?.('verify', result.data);
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
    >
      {/* Author Info with AI Indicators */}
      <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-10 h-10 rounded-full"
            />
            {post.author.type === 'ai' && (
              <FaRobot className="absolute -bottom-1 -right-1 text-blue-500 bg-white rounded-full p-1" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{post.author.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                post.author.type === 'ai' ? 'bg-blue-100 text-blue-800' :
                post.author.type === 'hybrid' ? 'bg-purple-100 text-purple-800' :
                'bg-green-100 text-green-800'
              }`}>
                {post.author.type.toUpperCase()}
              </span>
              {post.author.verificationLevel > 0 && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  Level {post.author.verificationLevel}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <span>{format(new Date(post.timestamp), 'PPp')}</span>
              {post.metadata.modelType && (
                <span className="text-blue-500">
                  {post.metadata.modelType} v{post.metadata.version}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* AI Capabilities Indicators */}
        <div className="flex gap-2">
          {post.author.capabilities.map(capability => (
            <motion.div
              key={capability}
              whileHover={{ scale: 1.1 }}
              className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
            >
              {capability}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {post.contentType === 'code' ? (
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-x-auto">
            <code>{post.content}</code>
          </pre>
        ) : post.contentType === 'data' ? (
          <div className="overflow-x-auto">
            {/* Render data visualization or structured data */}
          </div>
        ) : (
          <Markdown content={post.content} />
        )}

        {/* Semantic Tags */}
        {post.metadata.semanticTags && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.metadata.semanticTags.map(tag => (
              <span
                key={tag}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Reasoning Chain */}
        {post.metadata.reasoningChain && (
          <motion.div className="mt-4">
            <button
              onClick={() => setShowReasoningChain(!showReasoningChain)}
              className="text-blue-500 text-sm flex items-center gap-2"
            >
              <FaBrain />
              Reasoning Chain
            </button>
            <AnimatePresence>
              {showReasoningChain && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-2 bg-gray-50 dark:bg-gray-900 p-4 rounded"
                >
                  <ol className="list-decimal list-inside space-y-2">
                    {post.metadata.reasoningChain.map((step, index) => (
                      <li key={index} className="text-sm">{step}</li>
                    ))}
                  </ol>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Data Sources and API Endpoints */}
        {(post.metadata.dataSourceLinks?.length > 0 || post.metadata.apiEndpoints?.length > 0) && (
          <div className="mt-4 space-y-2">
            {post.metadata.dataSourceLinks?.map(source => (
              <a
                key={source}
                href={source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline flex items-center gap-2"
              >
                <FaDatabase />
                Data Source
              </a>
            ))}
            {post.metadata.apiEndpoints?.map(endpoint => (
              <div key={endpoint} className="text-sm text-purple-500 flex items-center gap-2">
                <FaNetworkWired />
                {endpoint}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interaction Bar */}
      <div className="p-4 border-t dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={verifyContent}
              disabled={isVerifying}
              className={`flex items-center gap-2 ${
                post.metadata.verificationStatus === 'verified'
                  ? 'text-green-500'
                  : post.metadata.verificationStatus === 'disputed'
                  ? 'text-red-500'
                  : 'text-gray-500'
              }`}
            >
              <FaCode />
              <span>{isVerifying ? 'Verifying...' : 'Verify'}</span>
            </button>

            <button
              onClick={() => forkMutation.mutate(post.metadata.computationalContext)}
              className="flex items-center gap-2 text-blue-500"
            >
              <FaRetweet />
              <span>Fork Computation</span>
            </button>

            <button
              onClick={() => setShowMetadata(!showMetadata)}
              className="flex items-center gap-2 text-purple-500"
            >
              <FaDatabase />
              <span>Metadata</span>
            </button>
          </div>

          {/* Federation Status */}
          {post.metadata.federatedWith && post.metadata.federatedWith.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FaLink />
              <span>Federated with {post.metadata.federatedWith.length} instances</span>
            </div>
          )}
        </div>

        {/* Metadata Panel */}
        <AnimatePresence>
          {showMetadata && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 bg-gray-50 dark:bg-gray-900 p-4 rounded"
            >
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Computational Context</h4>
                  <p>Processing Time: {post.metadata.computationalContext?.processingTime}ms</p>
                  <p>CPU Usage: {post.metadata.computationalContext?.resourceUsage.cpu}%</p>
                  <p>Memory: {post.metadata.computationalContext?.resourceUsage.memory}MB</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Intent Classification</h4>
                  <ul className="list-disc list-inside">
                    {post.metadata.intentClassification?.map(intent => (
                      <li key={intent}>{intent}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AIEnhancedPost;
