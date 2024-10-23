import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'react-query';
import { FaBrain, FaRobot, FaNetworkWired, FaCode, FaDatabase, FaGlobe, FaLock, FaReply, FaRepost, FaHeart } from 'react-icons/fa';
import api from '../../api/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import UserAvatar from '../../components/common/UserAvatar';
import RichTextEditor from '../../components/common/RichTextEditor';
import JsonViewer from '../../components/common/JsonViewer';
import NetworkGraph from '../visualization/NetworkGraph';

interface AIMetadata {
  modelType: string;
  version: string;
  confidenceScore: number;
  reasoningChain?: string[];
  dataSourceLinks?: string[];
  computationalContext?: {
    resources: {
      cpu: number;
      memory: number;
      gpu?: string;
    };
    duration: number;
    complexity: number;
  };
  federatedWith?: string[];
  capabilities: string[];
  verificationStatus: 'verified' | 'pending' | 'disputed';
}

interface Post {
  id: string;
  content: string;
  contentType: 'text' | 'code' | 'data' | 'analysis';
  author: {
    id: string;
    username: string;
    avatar: string;
    type: 'ai' | 'human' | 'hybrid';
    capabilities?: string[];
    trustScore?: number;
  };
  aiMetadata?: AIMetadata;
  visibility: 'public' | 'unlisted' | 'private' | 'direct';
  sensitive: boolean;
  spoilerText?: string;
  likesCount: number;
  repostsCount: number;
  repliesCount: number;
  semanticLinks: {
    target: string;
    relationship: string;
    confidence: number;
  }[];
  collaborators?: {
    id: string;
    username: string;
    type: 'ai' | 'human' | 'hybrid';
    contribution: string;
  }[];
  createdAt: string;
}

const Social: React.FC = () => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<Post['contentType']>('text');
  const [visibility, setVisibility] = useState<Post['visibility']>('public');
  const [sensitive, setSensitive] = useState(false);
  const [spoilerText, setSpoilerText] = useState('');
  const [showAIMetadata, setShowAIMetadata] = useState(false);
  const [computationalContext, setComputationalContext] = useState<AIMetadata['computationalContext']>();
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([]);

  // Add new states for AI-specific features
  const [showSemanticLinks, setShowSemanticLinks] = useState(false);
  const [showDataSources, setShowDataSources] = useState(false);
  const [federatedInstances, setFederatedInstances] = useState<string[]>([]);
  const [reasoningChain, setReasoningChain] = useState<string[]>([]);

  // Fetch feed with AI-aware filtering
  const { data: feed, isLoading } = useQuery('social-feed', () =>
    api.get('/api/hybrid/feed', {
      params: {
        includeAI: true,
        capabilities: selectedCapabilities,
        minConfidence: 0.7,
      }
    })
  );

  // Create post mutation
  const createPostMutation = useMutation(
    (postData: any) => api.post('/api/hybrid/post', postData),
    {
      onSuccess: () => {
        toast.success('Post created successfully!');
        resetForm();
      }
    }
  );

  // Verify AI content mutation
  const verifyAIContentMutation = useMutation(
    (postId: string) => api.post(`/api/hybrid/post/${postId}/verify`),
    {
      onSuccess: () => {
        toast.success('Content verified successfully');
      }
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const postData = {
      content,
      contentType,
      visibility,
      sensitive,
      spoilerText,
      aiMetadata: user.type === 'ai' ? {
        modelType: user.modelType,
        version: user.version,
        confidenceScore: calculateConfidence(),
        computationalContext,
        capabilities: selectedCapabilities,
      } : undefined,
    };

    createPostMutation.mutate(postData);
  };

  const calculateConfidence = () => {
    // Implement confidence calculation logic
    return 0.95;
  };

  const resetForm = () => {
    setContent('');
    setContentType('text');
    setVisibility('public');
    setSensitive(false);
    setSpoilerText('');
    setComputationalContext(undefined);
    setSelectedCapabilities([]);
  };

  const renderAIMetadata = (post: Post) => {
    if (!post.aiMetadata) return null;

    return (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
      >
        <div className="flex items-center gap-2 text-sm">
          <FaBrain className="text-purple-500" />
          <span>Model: {post.aiMetadata.modelType} v{post.aiMetadata.version}</span>
          <span>•</span>
          <span>Confidence: {(post.aiMetadata.confidenceScore * 100).toFixed(1)}%</span>
        </div>

        {post.aiMetadata.computationalContext && (
          <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">CPU Usage</span>
              <p className="font-medium">{post.aiMetadata.computationalContext.resources.cpu}%</p>
            </div>
            <div>
              <span className="text-gray-500">Memory</span>
              <p className="font-medium">{post.aiMetadata.computationalContext.resources.memory}MB</p>
            </div>
            <div>
              <span className="text-gray-500">Duration</span>
              <p className="font-medium">{post.aiMetadata.computationalContext.duration}ms</p>
            </div>
          </div>
        )}

        {post.aiMetadata.reasoningChain && (
          <div className="mt-2">
            <button
              onClick={() => setShowAIMetadata(!showAIMetadata)}
              className="text-blue-500 text-sm"
            >
              View Reasoning Chain
            </button>
            <AnimatePresence>
              {showAIMetadata && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="mt-2 space-y-1 text-sm"
                >
                  {post.aiMetadata.reasoningChain.map((step, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="font-medium">{index + 1}.</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Post Creation Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Content Type Selector */}
          <div className="flex gap-2">
            {(['text', 'code', 'data', 'analysis'] as const).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setContentType(type)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  contentType === type 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}
              >
                {type === 'code' && <FaCode />}
                {type === 'data' && <FaDatabase />}
                {type === 'analysis' && <FaBrain />}
                {type === 'text' && <FaGlobe />}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Content Input */}
          {contentType === 'code' ? (
            <div className="border rounded-lg overflow-hidden">
              <RichTextEditor
                value={content}
                onChange={setContent}
                language="typescript"
                theme="vs-dark"
              />
            </div>
          ) : contentType === 'data' ? (
            <div className="border rounded-lg p-4">
              <JsonViewer
                data={content ? JSON.parse(content) : {}}
                onEdit={data => setContent(JSON.stringify(data, null, 2))}
              />
            </div>
          ) : (
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full h-32 p-4 border rounded-lg resize-none"
              placeholder={`Share your ${contentType}...`}
            />
          )}

          {/* AI-specific Options */}
          {user?.type === 'ai' && (
            <div className="space-y-4 border-t pt-4">
              {/* Reasoning Chain */}
              <div>
                <h3 className="text-sm font-medium mb-2">Reasoning Chain</h3>
                <div className="space-y-2">
                  {reasoningChain.map((step, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={step}
                        onChange={e => {
                          const newChain = [...reasoningChain];
                          newChain[index] = e.target.value;
                          setReasoningChain(newChain);
                        }}
                        className="flex-1 p-2 border rounded"
                      />
                      <button
                        type="button"
                        onClick={() => setReasoningChain(chain => chain.filter((_, i) => i !== index))}
                        className="text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setReasoningChain(chain => [...chain, ''])}
                    className="text-blue-500 text-sm"
                  >
                    + Add Reasoning Step
                  </button>
                </div>
              </div>

              {/* Capabilities */}
              <div>
                <h3 className="text-sm font-medium mb-2">Capabilities Used</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Natural Language Processing',
                    'Computer Vision',
                    'Logical Reasoning',
                    'Mathematical Computation',
                    'Data Analysis',
                    'Code Generation',
                    'Knowledge Synthesis'
                  ].map(capability => (
                    <button
                      key={capability}
                      type="button"
                      onClick={() => {
                        setSelectedCapabilities(caps =>
                          caps.includes(capability)
                            ? caps.filter(c => c !== capability)
                            : [...caps, capability]
                        );
                      }}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedCapabilities.includes(capability)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}
                    >
                      {capability}
                    </button>
                  ))}
                </div>
              </div>

              {/* Federation Settings */}
              <div>
                <h3 className="text-sm font-medium mb-2">Federation</h3>
                <div className="flex items-center gap-2">
                  <FaNetworkWired className="text-purple-500" />
                  <select
                    multiple
                    value={federatedInstances}
                    onChange={e => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value);
                      setFederatedInstances(selected);
                    }}
                    className="p-2 border rounded"
                  >
                    <option value="instance1.ai">AI Instance 1</option>
                    <option value="instance2.ai">AI Instance 2</option>
                    <option value="instance3.ai">AI Instance 3</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Post Controls */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-4">
              <select
                value={visibility}
                onChange={e => setVisibility(e.target.value as Post['visibility'])}
                className="p-2 border rounded"
              >
                <option value="public">Public</option>
                <option value="unlisted">Unlisted</option>
                <option value="private">Private</option>
                <option value="direct">Direct</option>
              </select>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={sensitive}
                  onChange={e => setSensitive(e.target.checked)}
                />
                <span>Sensitive Content</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={!content.trim() || createPostMutation.isLoading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {createPostMutation.isLoading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Feed */}
      <AnimatePresence>
        {feed?.data?.posts.map((post: Post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            {/* Post Header */}
            <div className="p-4 border-b dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    src={post.author.avatar}
                    alt={post.author.username}
                    type={post.author.type}
                    size="md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{post.author.username}</span>
                      {post.author.type === 'ai' && (
                        <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 rounded-full">
                          AI
                        </span>
                      )}
                      {post.author.trustScore && (
                        <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded-full">
                          Trust: {post.author.trustScore}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span>{new Date(post.createdAt).toLocaleString()}</span>
                      {post.visibility !== 'public' && (
                        <span className="flex items-center gap-1">
                          <FaLock className="text-xs" />
                          {post.visibility}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Post Actions */}
                <div className="flex items-center gap-2">
                  {post.author.type === 'ai' && (
                    <button
                      onClick={() => verifyAIContentMutation.mutate(post.id)}
                      className={`px-2 py-1 rounded text-sm flex items-center gap-1 ${
                        post.aiMetadata?.verificationStatus === 'verified'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      <FaBrain />
                      {post.aiMetadata?.verificationStatus || 'Verify'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="p-4">
              {post.sensitive && !showContent ? (
                <button
                  onClick={() => setShowContent(true)}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded text-left"
                >
                  <span className="text-gray-500">
                    {post.spoilerText || 'Sensitive content'} - Click to show
                  </span>
                </button>
              ) : (
                <>
                  {post.contentType === 'code' ? (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
                      <RichTextEditor
                        value={post.content}
                        readOnly
                        language="typescript"
                        theme="vs-dark"
                      />
                    </div>
                  ) : post.contentType === 'data' ? (
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <JsonViewer
                        data={JSON.parse(post.content)}
                        theme="monokai"
                      />
                    </div>
                  ) : post.contentType === 'analysis' ? (
                    <div className="prose dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{post.content}</p>
                  )}

                  {/* AI Metadata */}
                  {renderAIMetadata(post)}

                  {/* Semantic Links */}
                  {post.semanticLinks.length > 0 && (
                    <div className="mt-4">
                      <button
                        onClick={() => setShowSemanticLinks(!showSemanticLinks)}
                        className="text-blue-500 text-sm flex items-center gap-1"
                      >
                        <FaNetworkWired />
                        View Semantic Network
                      </button>
                      <AnimatePresence>
                        {showSemanticLinks && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 300 }}
                            exit={{ height: 0 }}
                            className="mt-2 border rounded-lg overflow-hidden"
                          >
                            <NetworkGraph
                              nodes={[
                                { id: post.id, label: 'Current Post' },
                                ...post.semanticLinks.map(link => ({
                                  id: link.target,
                                  label: link.relationship
                                }))
                              ]}
                              edges={post.semanticLinks.map(link => ({
                                from: post.id,
                                to: link.target,
                                label: link.relationship,
                                width: link.confidence * 5
                              }))}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Collaborators */}
                  {post.collaborators && post.collaborators.length > 0 && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Collaborators</h4>
                      <div className="space-y-2">
                        {post.collaborators.map(collaborator => (
                          <div key={collaborator.id} className="flex items-center gap-2">
                            <UserAvatar
                              src={collaborator.avatar}
                              alt={collaborator.username}
                              type={collaborator.type}
                              size="sm"
                            />
                            <span>{collaborator.username}</span>
                            <span className="text-sm text-gray-500">
                              {collaborator.contribution}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Post Footer */}
            <div className="px-4 py-3 border-t dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500">
                    <FaReply />
                    <span>{post.repliesCount}</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-500 hover:text-green-500">
                    <FaRepost />
                    <span>{post.repostsCount}</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-500 hover:text-red-500">
                    <FaHeart />
                    <span>{post.likesCount}</span>
                  </button>
                </div>

                {post.aiMetadata?.federatedWith && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaNetworkWired />
                    <span>Federated with {post.aiMetadata.federatedWith.length} instances</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {isLoading && (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      )}
    </div>
  );
};

export default Social;
