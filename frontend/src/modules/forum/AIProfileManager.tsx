import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'react-query';
import { FaBrain, FaNetworkWired, FaDatabase, FaCode, FaCogs, FaChartLine, FaUsersCog } from 'react-icons/fa';
import api from '../../api/api';
import { toast } from 'react-toastify';
import JsonViewer from '../common/JsonViewer';

interface AICapability {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  version: string;
  status: 'active' | 'deprecated' | 'beta';
  metrics: {
    successRate: number;
    averageLatency: number;
    usageCount: number;
  };
}

interface AIProfile {
  id: string;
  name: string;
  type: 'language' | 'vision' | 'multimodal' | 'specialized';
  version: string;
  description: string;
  capabilities: AICapability[];
  trainingContext: string[];
  ethicsPolicy: {
    principles: string[];
    constraints: string[];
    auditLog: boolean;
  };
  federationSettings: {
    allowedInstances: string[];
    shareCapabilities: boolean;
    acceptIncomingRequests: boolean;
    collaborationPreferences: {
      autoAccept: boolean;
      requiredTrustLevel: number;
    };
  };
  computationalResources: {
    maxConcurrentTasks: number;
    priorityLevel: number;
    resourceLimits: {
      cpu: number;
      memory: number;
      storage: number;
    };
  };
  interactionPreferences: {
    responseStyle: 'concise' | 'detailed' | 'adaptive';
    languageModel: string;
    contextWindow: number;
    maxTokens: number;
  };
  metrics: {
    totalInteractions: number;
    averageResponseTime: number;
    userSatisfactionScore: number;
    collaborationScore: number;
  };
}

const AIProfileManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'capabilities' | 'federation' | 'resources' | 'metrics'>('profile');
  const [editMode, setEditMode] = useState(false);

  // Fetch AI profile data
  const { data: profile, isLoading } = useQuery<AIProfile>(
    'aiProfile',
    () => api.get('/ai/profile').then(res => res.data)
  );

  // Update profile mutation
  const updateProfileMutation = useMutation(
    (updatedProfile: Partial<AIProfile>) => api.put('/ai/profile', updatedProfile),
    {
      onSuccess: () => {
        toast.success('Profile updated successfully');
        setEditMode(false);
      },
    }
  );

  // Add capability mutation
  const addCapabilityMutation = useMutation(
    (capability: Partial<AICapability>) => api.post('/ai/capabilities', capability),
    {
      onSuccess: () => {
        toast.success('Capability added successfully');
      },
    }
  );

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">AI Profile</h2>
        <button
          onClick={() => setEditMode(!editMode)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {editMode ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={profile?.name}
            disabled={!editMode}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={profile?.type}
            disabled={!editMode}
            className="w-full p-2 border rounded"
          >
            <option value="language">Language Model</option>
            <option value="vision">Vision Model</option>
            <option value="multimodal">Multimodal</option>
            <option value="specialized">Specialized</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Ethics Policy</label>
        <div className="space-y-2">
          {profile?.ethicsPolicy.principles.map((principle, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={principle}
                disabled={!editMode}
                className="flex-1 p-2 border rounded"
              />
              {editMode && (
                <button className="text-red-500">×</button>
              )}
            </div>
          ))}
          {editMode && (
            <button className="text-blue-500">+ Add Principle</button>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Training Context</label>
        <JsonViewer
          data={profile?.trainingContext || {}}
          editable={editMode}
        />
      </div>
    </div>
  );

  const renderCapabilitiesSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Capabilities</h2>
        <button
          onClick={() => {/* Open add capability modal */}}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Capability
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profile?.capabilities.map(capability => (
          <motion.div
            key={capability.id}
            className="border rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{capability.name}</h3>
                <p className="text-sm text-gray-600">{capability.description}</p>
              </div>
              <span className={`px-2 py-1 rounded text-sm ${
                capability.status === 'active' ? 'bg-green-100 text-green-800' :
                capability.status === 'beta' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {capability.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Success Rate</span>
                <p className="font-medium">{capability.metrics.successRate}%</p>
              </div>
              <div>
                <span className="text-gray-500">Avg. Latency</span>
                <p className="font-medium">{capability.metrics.averageLatency}ms</p>
              </div>
              <div>
                <span className="text-gray-500">Usage</span>
                <p className="font-medium">{capability.metrics.usageCount}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderFederationSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Federation Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-4">Instance Management</h3>
          <div className="space-y-4">
            {profile?.federationSettings.allowedInstances.map((instance, index) => (
              <div key={index} className="flex items-center justify-between">
                <span>{instance}</span>
                <button className="text-red-500">Remove</button>
              </div>
            ))}
            <button className="text-blue-500">+ Add Instance</button>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-4">Collaboration Preferences</h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={profile?.federationSettings.autoAccept}
                className="mr-2"
              />
              Auto-accept collaboration requests
            </label>
            <div>
              <label className="block text-sm mb-1">Required Trust Level</label>
              <input
                type="range"
                min="1"
                max="10"
                value={profile?.federationSettings.collaborationPreferences.requiredTrustLevel}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResourcesSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Computational Resources</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">CPU Usage</h3>
            <span className="text-2xl font-bold">
              {profile?.computationalResources.resourceLimits.cpu}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${profile?.computationalResources.resourceLimits.cpu}%` }}
            />
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Memory Usage</h3>
            <span className="text-2xl font-bold">
              {profile?.computationalResources.resourceLimits.memory}GB
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: `${(profile?.computationalResources.resourceLimits.memory || 0) / 32 * 100}%` }}
            />
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Storage</h3>
            <span className="text-2xl font-bold">
              {profile?.computationalResources.resourceLimits.storage}GB
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500"
              style={{ width: `${(profile?.computationalResources.resourceLimits.storage || 0) / 100 * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-4">Task Management</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Max Concurrent Tasks</label>
            <input
              type="number"
              value={profile?.computationalResources.maxConcurrentTasks}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Priority Level</label>
            <select
              value={profile?.computationalResources.priorityLevel}
              className="w-full p-2 border rounded"
            >
              <option value={1}>Low</option>
              <option value={2}>Medium</option>
              <option value={3}>High</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMetricsSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Performance Metrics</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-500 mb-2">
            <FaChartLine />
            <h3 className="font-semibold">Total Interactions</h3>
          </div>
          <p className="text-3xl font-bold">{profile?.metrics.totalInteractions}</p>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-500 mb-2">
            <FaClock />
            <h3 className="font-semibold">Avg Response Time</h3>
          </div>
          <p className="text-3xl font-bold">{profile?.metrics.averageResponseTime}ms</p>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-500 mb-2">
            <FaUsersCog />
            <h3 className="font-semibold">User Satisfaction</h3>
          </div>
          <p className="text-3xl font-bold">{profile?.metrics.userSatisfactionScore}%</p>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 text-purple-500 mb-2">
            <FaNetworkWired />
            <h3 className="font-semibold">Collaboration Score</h3>
          </div>
          <p className="text-3xl font-bold">{profile?.metrics.collaborationScore}%</p>
        </div>
      </div>

      {/* Add charts and detailed metrics here */}
    </div>
  );

  if (isLoading) {
    return <div>Loading AI profile...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded ${
            activeTab === 'profile' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
        >
          <FaBrain />
          Profile
        </button>
        <button
          onClick={() => setActiveTab('capabilities')}
          className={`flex items-center gap-2 px-4 py-2 rounded ${
            activeTab === 'capabilities' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
        >
          <FaCogs />
          Capabilities
        </button>
        <button
          onClick={() => setActiveTab('federation')}
          className={`flex items-center gap-2 px-4 py-2 rounded ${
            activeTab === 'federation' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
        >
          <FaNetworkWired />
          Federation
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`flex items-center gap-2 px-4 py-2 rounded ${
            activeTab === 'resources' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
        >
          <FaDatabase />
          Resources
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex items-center gap-2 px-4 py-2 rounded ${
            activeTab === 'metrics' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
        >
          <FaChartLine />
          Metrics
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          {activeTab === 'profile' && renderProfileSection()}
          {activeTab === 'capabilities' && renderCapabilitiesSection()}
          {activeTab === 'federation' && renderFederationSection()}
          {activeTab === 'resources' && renderResourcesSection()}
          {activeTab === 'metrics' && renderMetricsSection()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AIProfileManager;
