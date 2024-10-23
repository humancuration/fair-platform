import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'react-query';
import { FaBrain, FaCode, FaDatabase, FaNetworkWired, FaGitAlt, FaLock } from 'react-icons/fa';
import api from '../../api/api';
import { toast } from 'react-toastify';
import JsonViewer from '../common/JsonViewer';
import CodeEditor from '../common/CodeEditor';
import NetworkGraph from '../visualization/NetworkGraph';

interface KnowledgeFragment {
  id: string;
  type: 'concept' | 'model' | 'dataset' | 'insight' | 'computation';
  content: {
    data: any;
    metadata: {
      format: string;
      schema?: string;
      version: string;
      computationalContext?: {
        resources: {
          cpu: number;
          memory: number;
          gpu?: string;
        };
        duration: number;
        timestamp: string;
      };
    };
  };
  validations: {
    validator: {
      id: string;
      name: string;
      type: 'ai' | 'human';
      trustScore: number;
    };
    score: number;
    reasoning: string[];
    timestamp: string;
  }[];
  semanticLinks: {
    target: string;
    relationship: string;
    confidence: number;
    bidirectional: boolean;
  }[];
  contributors: {
    id: string;
    name: string;
    type: 'ai' | 'human';
    contribution: string;
    timestamp: string;
  }[];
  verificationChain: {
    step: number;
    verifier: string;
    method: string;
    result: boolean;
    confidence: number;
    timestamp: string;
  }[];
  accessControl: {
    visibility: 'public' | 'private' | 'verified_ai_only';
    encryptionType?: string;
    requiredCapabilities?: string[];
    minimumTrustScore?: number;
  };
}

const AIKnowledgeExchange: React.FC = () => {
  const [selectedFragment, setSelectedFragment] = useState<KnowledgeFragment | null>(null);
  const [verificationMode, setVerificationMode] = useState(false);
  const [contributionMode, setContributionMode] = useState(false);

  // Fetch knowledge fragments
  const { data: fragments } = useQuery('knowledgeFragments', 
    () => api.get('/ai/knowledge').then(res => res.data)
  );

  // Share knowledge mutation
  const shareKnowledgeMutation = useMutation(
    (knowledge: Partial<KnowledgeFragment>) => api.post('/ai/knowledge/share', knowledge),
    {
      onSuccess: () => {
        toast.success('Knowledge shared successfully');
      }
    }
  );

  // Validate knowledge mutation
  const validateKnowledgeMutation = useMutation(
    (validation: { fragmentId: string; score: number; reasoning: string[] }) =>
      api.post('/ai/knowledge/validate', validation),
    {
      onSuccess: () => {
        toast.success('Validation submitted');
      }
    }
  );

  // Contribute to knowledge mutation
  const contributeKnowledgeMutation = useMutation(
    (contribution: { fragmentId: string; content: any; type: string }) =>
      api.post('/ai/knowledge/contribute', contribution),
    {
      onSuccess: () => {
        toast.success('Contribution added');
      }
    }
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">AI Knowledge Exchange</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setVerificationMode(!verificationMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              verificationMode ? 'bg-green-500 text-white' : 'bg-gray-100'
            }`}
          >
            <FaGitAlt />
            Verification Mode
          </button>
          <button
            onClick={() => setContributionMode(!contributionMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              contributionMode ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            <FaBrain />
            Contribution Mode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Knowledge Network Visualization */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Knowledge Network</h3>
          <NetworkGraph
            nodes={fragments?.map((f: KnowledgeFragment) => ({
              id: f.id,
              label: f.type,
              size: f.validations.length + 1,
              color: getNodeColor(f.type),
              trustScore: calculateTrustScore(f)
            }))}
            edges={fragments?.flatMap((f: KnowledgeFragment) => 
              f.semanticLinks.map((link: KnowledgeFragment['semanticLinks'][0]) => ({
                from: f.id,
                to: link.target,
                label: link.relationship,
                width: link.confidence,
                bidirectional: link.bidirectional
              }))
            )}
            onNodeClick={(nodeId: string) => {
              const fragment = fragments?.find((f: KnowledgeFragment) => f.id === nodeId);
              if (fragment) setSelectedFragment(fragment);
            }}
          />
        </div>

        {/* Knowledge Details */}
        <AnimatePresence mode="wait">
          {selectedFragment && (
            <motion.div
              key={selectedFragment.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{selectedFragment.type}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{selectedFragment.contributors.length} contributors</span>
                    <span>•</span>
                    <span>{selectedFragment.validations.length} validations</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedFragment.accessControl.visibility === 'verified_ai_only' && (
                    <FaLock className="text-purple-500" />
                  )}
                  <button
                    onClick={() => setSelectedFragment(null)}
                    className="text-gray-500"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Content Viewer */}
                <div>
                  <h4 className="font-medium mb-2">Content</h4>
                  {selectedFragment.content.metadata.format === 'code' ? (
                    <CodeEditor
                      value={selectedFragment.content.data}
                      language={selectedFragment.content.metadata.schema || 'javascript'}
                      readOnly
                    />
                  ) : (
                    <JsonViewer
                      data={selectedFragment.content.data}
                      theme="monokai"
                    />
                  )}
                </div>

                {/* Computational Context */}
                {selectedFragment.content.metadata.computationalContext && (
                  <div>
                    <h4 className="font-medium mb-2">Computational Context</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="p-2 bg-gray-50 rounded">
                        <span className="text-gray-500">CPU Usage</span>
                        <p className="font-medium">
                          {selectedFragment.content.metadata.computationalContext.resources.cpu}%
                        </p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <span className="text-gray-500">Memory</span>
                        <p className="font-medium">
                          {selectedFragment.content.metadata.computationalContext.resources.memory}MB
                        </p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <span className="text-gray-500">Duration</span>
                        <p className="font-medium">
                          {selectedFragment.content.metadata.computationalContext.duration}ms
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Verification Chain */}
                <div>
                  <h4 className="font-medium mb-2">Verification Chain</h4>
                  <div className="space-y-2">
                    {selectedFragment.verificationChain.map((step, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded ${
                          step.result ? 'bg-green-50' : 'bg-red-50'
                        }`}
                      >
                        <div className="flex justify-between text-sm">
                          <span>Step {step.step}: {step.method}</span>
                          <span>Confidence: {(step.confidence * 100).toFixed(1)}%</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Verified by {step.verifier}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contribution Form */}
                {contributionMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t pt-4 mt-4"
                  >
                    <h4 className="font-medium mb-2">Add Contribution</h4>
                    <CodeEditor
                      value=""
                      onChange={(value: string) => {
                        contributeKnowledgeMutation.mutate({
                          fragmentId: selectedFragment.id,
                          content: value,
                          type: 'enhancement'
                        });
                      }}
                    />
                  </motion.div>
                )}

                {/* Verification Form */}
                {verificationMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t pt-4 mt-4"
                  >
                    <h4 className="font-medium mb-2">Verify Knowledge</h4>
                    <div className="space-y-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        className="w-full"
                        onChange={(e) => {
                          validateKnowledgeMutation.mutate({
                            fragmentId: selectedFragment.id,
                            score: parseInt(e.target.value) / 100,
                            reasoning: ['Automated verification based on computational analysis']
                          });
                        }}
                      />
                      <button
                        onClick={() => {
                          validateKnowledgeMutation.mutate({
                            fragmentId: selectedFragment.id,
                            score: 1,
                            reasoning: ['Full verification through formal proof']
                          });
                        }}
                        className="w-full bg-green-500 text-white py-2 rounded"
                      >
                        Verify with Formal Proof
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Helper functions
const getNodeColor = (type: string) => {
  const colors = {
    concept: '#4CAF50',
    model: '#2196F3',
    dataset: '#9C27B0',
    insight: '#FF9800',
    computation: '#F44336'
  };
  return colors[type as keyof typeof colors] || '#757575';
};

const calculateTrustScore = (fragment: KnowledgeFragment) => {
  const validationScore = fragment.validations.reduce((acc, val) => acc + val.score, 0) / 
    (fragment.validations.length || 1);
  
  const verificationScore = fragment.verificationChain.reduce((acc, step) => 
    acc + (step.result ? step.confidence : 0), 0) /
    fragment.verificationChain.length;

  return (validationScore + verificationScore) / 2;
};

export default AIKnowledgeExchange;
