import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'react-query';
import { FaBrain, FaCode, FaDatabase, FaNetworkWired, FaGitAlt, FaShareAlt } from 'react-icons/fa';
import api from '../../api/api';
import { toast } from 'react-toastify';
import CodeEditor from '../common/CodeEditor';
import JsonViewer from '../common/JsonViewer';
import NetworkGraph from '../visualization/NetworkGraph';

interface ComputationalContext {
  id: string;
  type: 'inference' | 'training' | 'analysis' | 'synthesis';
  resources: {
    cpu: number;
    memory: number;
    gpu?: string;
    tpu?: string;
  };
  parameters: Record<string, any>;
  status: 'idle' | 'running' | 'completed' | 'failed';
  results?: any;
  sharedBy: {
    id: string;
    name: string;
    type: 'ai' | 'human' | 'hybrid';
    capabilities: string[];
  };
}

interface KnowledgeFragment {
  id: string;
  type: 'concept' | 'model' | 'dataset' | 'insight';
  content: any;
  confidence: number;
  sources: string[];
  validations: {
    id: string;
    validatorId: string;
    score: number;
    comments: string;
  }[];
  semanticLinks: {
    target: string;
    relationship: string;
    strength: number;
  }[];
}

const AICollaborationSpace: React.FC = () => {
  const [activeContext, setActiveContext] = useState<ComputationalContext | null>(null);
  const [selectedKnowledge, setSelectedKnowledge] = useState<KnowledgeFragment | null>(null);
  const [collaborationMode, setCollaborationMode] = useState<'compute' | 'share' | 'validate'>('compute');

  // Fetch available computational contexts
  const { data: contexts } = useQuery('computationalContexts', 
    () => api.get('/ai/contexts').then(res => res.data)
  );

  // Fetch knowledge fragments
  const { data: knowledgeFragments } = useQuery('knowledgeFragments',
    () => api.get('/ai/knowledge').then(res => res.data)
  );

  // Mutation for sharing computational results
  const shareResultsMutation = useMutation(
    (results: any) => api.post('/ai/share-computation', results),
    {
      onSuccess: () => {
        toast.success('Computational results shared successfully');
      }
    }
  );

  // Mutation for validating knowledge
  const validateKnowledgeMutation = useMutation(
    (validation: any) => api.post('/ai/validate-knowledge', validation),
    {
      onSuccess: () => {
        toast.success('Knowledge validation submitted');
      }
    }
  );

  const handleComputationRequest = async (context: ComputationalContext) => {
    try {
      const result = await api.post('/ai/compute', {
        contextId: context.id,
        parameters: context.parameters
      });
      
      setActiveContext({
        ...context,
        status: 'completed',
        results: result.data
      });
    } catch (error) {
      toast.error('Computation failed');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">AI Collaboration Space</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setCollaborationMode('compute')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              collaborationMode === 'compute' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            <FaBrain />
            Compute
          </button>
          <button
            onClick={() => setCollaborationMode('share')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              collaborationMode === 'share' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            <FaShareAlt />
            Share
          </button>
          <button
            onClick={() => setCollaborationMode('validate')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              collaborationMode === 'validate' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            <FaGitAlt />
            Validate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Computational Contexts */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Computational Contexts</h3>
          <div className="space-y-4">
            {contexts?.map(context => (
              <motion.div
                key={context.id}
                className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveContext(context)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaCode className="text-blue-500" />
                    <span className="font-medium">{context.type}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    context.status === 'completed' ? 'bg-green-100 text-green-800' :
                    context.status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {context.status}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <div>CPU: {context.resources.cpu}%</div>
                  <div>Memory: {context.resources.memory}MB</div>
                  {context.resources.gpu && <div>GPU: {context.resources.gpu}</div>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Knowledge Fragments */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Knowledge Network</h3>
          <NetworkGraph
            nodes={knowledgeFragments?.map(k => ({
              id: k.id,
              label: k.type,
              size: k.validations.length + 1,
              color: k.confidence > 0.8 ? '#4CAF50' : '#FFC107'
            }))}
            edges={knowledgeFragments?.flatMap(k => 
              k.semanticLinks.map(link => ({
                from: k.id,
                to: link.target,
                label: link.relationship,
                width: link.strength
              }))
            )}
            onNodeClick={(nodeId) => {
              const fragment = knowledgeFragments?.find(k => k.id === nodeId);
              if (fragment) setSelectedKnowledge(fragment);
            }}
          />
        </div>
      </div>

      {/* Active Context Panel */}
      <AnimatePresence>
        {activeContext && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t pt-6"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold">Active Computation</h3>
              <button
                onClick={() => handleComputationRequest(activeContext)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={activeContext.status === 'running'}
              >
                {activeContext.status === 'running' ? 'Computing...' : 'Execute'}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Parameters</h4>
                <CodeEditor
                  value={JSON.stringify(activeContext.parameters, null, 2)}
                  language="json"
                  onChange={(value) => {
                    setActiveContext({
                      ...activeContext,
                      parameters: JSON.parse(value)
                    });
                  }}
                />
              </div>

              <div>
                <h4 className="font-medium mb-2">Results</h4>
                <JsonViewer
                  data={activeContext.results || {}}
                  theme="monokai"
                />
              </div>
            </div>

            {activeContext.status === 'completed' && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => shareResultsMutation.mutate(activeContext.results)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  <FaShareAlt />
                  Share Results
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Knowledge Validation Panel */}
      <AnimatePresence>
        {selectedKnowledge && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t pt-6"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold">Knowledge Validation</h3>
              <button
                onClick={() => setSelectedKnowledge(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <h4 className="font-medium mb-2">Content</h4>
                <JsonViewer
                  data={selectedKnowledge.content}
                  theme="monokai"
                />
              </div>

              <div>
                <h4 className="font-medium mb-2">Validations</h4>
                <div className="space-y-2">
                  {selectedKnowledge.validations.map(validation => (
                    <div
                      key={validation.id}
                      className="p-2 border rounded"
                    >
                      <div className="flex justify-between">
                        <span>{validation.validatorId}</span>
                        <span className="font-medium">Score: {validation.score}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {validation.comments}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => validateKnowledgeMutation.mutate({
                    knowledgeId: selectedKnowledge.id,
                    score: 0.9,
                    comments: 'Validated through computational verification'
                  })}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                  <FaGitAlt />
                  Submit Validation
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AICollaborationSpace;
