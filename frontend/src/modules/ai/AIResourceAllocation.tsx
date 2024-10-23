import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'react-query';
import { FaServer, FaMemory, FaMicrochip, FaNetworkWired, FaExchangeAlt, FaChartLine } from 'react-icons/fa';
import api from '../../api/api';
import { toast } from 'react-toastify';
import ResourceUsageGraph from '../visualization/ResourceUsageGraph';
import GPUMarketplaceWidget from '../marketplace/GPUMarketplaceWidget';

interface ComputeResource {
  id: string;
  type: 'CPU' | 'GPU' | 'TPU' | 'Memory' | 'Storage' | 'Network';
  specs: {
    model?: string;
    cores?: number;
    memory?: number;
    bandwidth?: number;
    performance?: number;
  };
  utilization: number;
  cost: number;
  provider: {
    id: string;
    name: string;
    reputation: number;
    location: string;
  };
  availability: {
    start: string;
    end: string;
    timeZone: string;
  };
  status: 'available' | 'reserved' | 'in-use';
}

interface ResourceAllocation {
  id: string;
  resourceId: string;
  aiId: string;
  startTime: string;
  endTime: string;
  priority: number;
  taskType: 'training' | 'inference' | 'data-processing';
  requirements: {
    minCores?: number;
    minMemory?: number;
    minBandwidth?: number;
    preferredProvider?: string;
    maxLatency?: number;
  };
  status: 'scheduled' | 'active' | 'completed' | 'failed';
  metrics?: {
    utilizationRate: number;
    costPerHour: number;
    performanceScore: number;
  };
}

const AIResourceAllocation: React.FC<{ aiId: string }> = ({ aiId }) => {
  const [selectedResource, setSelectedResource] = useState<ComputeResource | null>(null);
  const [showGPUMarketplace, setShowGPUMarketplace] = useState(false);
  const [allocationForm, setAllocationForm] = useState<Partial<ResourceAllocation>>({
    priority: 1,
    taskType: 'inference',
  });

  // Fetch available resources
  const { data: resources } = useQuery(
    ['computeResources', aiId],
    () => api.get('/ai/compute-resources').then(res => res.data)
  );

  // Fetch current allocations
  const { data: allocations } = useQuery(
    ['resourceAllocations', aiId],
    () => api.get(`/ai/resource-allocations/${aiId}`).then(res => res.data)
  );

  // Resource allocation mutation
  const allocateResourceMutation = useMutation(
    (allocation: Partial<ResourceAllocation>) => 
      api.post('/ai/allocate-resource', allocation),
    {
      onSuccess: () => {
        toast.success('Resource allocated successfully');
      }
    }
  );

  // Resource trading mutation
  const tradeResourceMutation = useMutation(
    (trade: { offeredResourceId: string; requestedResourceId: string }) =>
      api.post('/ai/trade-resources', trade),
    {
      onSuccess: () => {
        toast.success('Resource trade completed');
      }
    }
  );

  const handleResourceAllocation = async () => {
    if (!selectedResource) return;

    try {
      await allocateResourceMutation.mutateAsync({
        ...allocationForm,
        resourceId: selectedResource.id,
        aiId,
      });
    } catch (error) {
      console.error('Failed to allocate resource:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resource Allocation</h2>
        <button
          onClick={() => setShowGPUMarketplace(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          <FaExchangeAlt />
          GPU Marketplace
        </button>
      </div>

      {/* Resource Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources?.map(resource => (
          <motion.div
            key={resource.id}
            className={`p-6 rounded-lg shadow-lg cursor-pointer ${
              selectedResource?.id === resource.id
                ? 'border-2 border-blue-500'
                : 'border border-gray-200'
            }`}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedResource(resource)}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                {resource.type === 'CPU' && <FaMicrochip className="text-blue-500" />}
                {resource.type === 'GPU' && <FaServer className="text-green-500" />}
                {resource.type === 'Memory' && <FaMemory className="text-purple-500" />}
                {resource.type === 'Network' && <FaNetworkWired className="text-orange-500" />}
                <div>
                  <h3 className="font-semibold">{resource.type}</h3>
                  <p className="text-sm text-gray-500">{resource.specs.model}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-sm ${
                resource.status === 'available' ? 'bg-green-100 text-green-800' :
                resource.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {resource.status}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Utilization</span>
                <span>{resource.utilization}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${resource.utilization}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span>Cost</span>
                <span>${resource.cost}/hour</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Allocation Form */}
      <AnimatePresence>
        {selectedResource && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border rounded-lg p-6"
          >
            <h3 className="text-xl font-semibold mb-4">Resource Allocation</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Task Type</label>
                <select
                  value={allocationForm.taskType}
                  onChange={(e) => setAllocationForm({
                    ...allocationForm,
                    taskType: e.target.value as ResourceAllocation['taskType']
                  })}
                  className="w-full p-2 border rounded"
                >
                  <option value="inference">Inference</option>
                  <option value="training">Training</option>
                  <option value="data-processing">Data Processing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={allocationForm.priority}
                  onChange={(e) => setAllocationForm({
                    ...allocationForm,
                    priority: parseInt(e.target.value)
                  })}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Start Time</label>
                <input
                  type="datetime-local"
                  value={allocationForm.startTime}
                  onChange={(e) => setAllocationForm({
                    ...allocationForm,
                    startTime: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">End Time</label>
                <input
                  type="datetime-local"
                  value={allocationForm.endTime}
                  onChange={(e) => setAllocationForm({
                    ...allocationForm,
                    endTime: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleResourceAllocation}
                disabled={allocateResourceMutation.isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {allocateResourceMutation.isLoading ? 'Allocating...' : 'Allocate Resource'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resource Usage Analytics */}
      <div className="border rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Resource Usage Analytics</h3>
        <ResourceUsageGraph
          data={allocations?.map(allocation => ({
            resourceId: allocation.resourceId,
            utilizationRate: allocation.metrics?.utilizationRate || 0,
            costPerHour: allocation.metrics?.costPerHour || 0,
            performanceScore: allocation.metrics?.performanceScore || 0,
          }))}
        />
      </div>

      {/* GPU Marketplace Modal */}
      <AnimatePresence>
        {showGPUMarketplace && (
          <GPUMarketplaceWidget
            onClose={() => setShowGPUMarketplace(false)}
            onPurchase={(gpuResource) => {
              // Handle GPU purchase/rental
              setShowGPUMarketplace(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIResourceAllocation;
