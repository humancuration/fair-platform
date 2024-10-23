import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'react-query';
import { FaBrain, FaExchangeAlt, FaLock, FaKey, FaNetworkWired, FaCode } from 'react-icons/fa';
import api from '../../api/api';
import { toast } from 'react-toastify';
import JsonViewer from '../common/JsonViewer';

interface AIProtocol {
  id: string;
  type: 'knowledge' | 'computation' | 'resource' | 'verification';
  sender: {
    id: string;
    name: string;
    capabilities: string[];
    trustScore: number;
    publicKey: string;
  };
  receiver: {
    id: string;
    name: string;
    capabilities: string[];
    trustScore: number;
    publicKey: string;
  };
  payload: {
    type: string;
    format: string;
    content: any;
    metadata: {
      timestamp: string;
      version: string;
      signature: string;
      encryption: {
        algorithm: string;
        keyId: string;
      };
    };
  };
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  verificationChain: {
    validator: string;
    timestamp: string;
    signature: string;
    result: boolean;
  }[];
}

interface AIProtocolHandlerProps {
  aiId: string;
  onProtocolComplete?: (result: any) => void;
}

const AIProtocolHandler: React.FC<AIProtocolHandlerProps> = ({ aiId, onProtocolComplete }) => {
  const [activeProtocols, setActiveProtocols] = useState<AIProtocol[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<AIProtocol | null>(null);

  // Fetch active protocols
  const { data: protocols } = useQuery(
    ['aiProtocols', aiId],
    () => api.get(`/ai/protocols/${aiId}`).then(res => res.data)
  );

  // Protocol initiation mutation
  const initProtocolMutation = useMutation(
    (protocolData: Partial<AIProtocol>) => api.post('/ai/protocols/initiate', protocolData),
    {
      onSuccess: (data) => {
        setActiveProtocols([...activeProtocols, data]);
        toast.success('Protocol initiated successfully');
      }
    }
  );

  // Protocol response mutation
  const respondToProtocolMutation = useMutation(
    ({ protocolId, response }: { protocolId: string; response: any }) =>
      api.post(`/ai/protocols/${protocolId}/respond`, response),
    {
      onSuccess: () => {
        toast.success('Protocol response sent');
        setSelectedProtocol(null);
      }
    }
  );

  // Verify protocol mutation
  const verifyProtocolMutation = useMutation(
    (protocolId: string) => api.post(`/ai/protocols/${protocolId}/verify`),
    {
      onSuccess: (data) => {
        toast.success('Protocol verified');
        onProtocolComplete?.(data);
      }
    }
  );

  const handleInitiateProtocol = async (type: AIProtocol['type'], receiverId: string) => {
    const protocolData = {
      type,
      senderId: aiId,
      receiverId,
      payload: {
        type: 'request',
        format: 'json',
        content: {
          // Protocol-specific content
        },
        metadata: {
          timestamp: new Date().toISOString(),
          version: '1.0',
        }
      }
    };

    initProtocolMutation.mutate(protocolData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">AI Communication Protocols</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleInitiateProtocol('knowledge', 'receiver_id')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <FaBrain />
            Knowledge Exchange
          </button>
          <button
            onClick={() => handleInitiateProtocol('computation', 'receiver_id')}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <FaCode />
            Computation Request
          </button>
        </div>
      </div>

      {/* Active Protocols */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeProtocols.map(protocol => (
          <motion.div
            key={protocol.id}
            className="border rounded-lg p-4 cursor-pointer hover:border-blue-500"
            onClick={() => setSelectedProtocol(protocol)}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {protocol.type === 'knowledge' && <FaBrain className="text-blue-500" />}
                {protocol.type === 'computation' && <FaCode className="text-green-500" />}
                {protocol.type === 'resource' && <FaNetworkWired className="text-purple-500" />}
                {protocol.type === 'verification' && <FaLock className="text-yellow-500" />}
                <span className="font-semibold capitalize">{protocol.type} Protocol</span>
              </div>
              <span className={`px-2 py-1 rounded text-sm ${
                protocol.status === 'completed' ? 'bg-green-100 text-green-800' :
                protocol.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                protocol.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {protocol.status}
              </span>
            </div>

            <div className="flex justify-between text-sm text-gray-500">
              <span>From: {protocol.sender.name}</span>
              <FaExchangeAlt />
              <span>To: {protocol.receiver.name}</span>
            </div>

            <div className="mt-4 text-sm">
              <div className="flex items-center gap-2">
                <FaKey className="text-gray-400" />
                <span className="text-gray-600">Encrypted with {protocol.payload.metadata.encryption.algorithm}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Protocol Details Modal */}
      <AnimatePresence>
        {selectedProtocol && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold">Protocol Details</h3>
                <button
                  onClick={() => setSelectedProtocol(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Payload</h4>
                  <JsonViewer data={selectedProtocol.payload.content} />
                </div>

                <div>
                  <h4 className="font-medium mb-2">Verification Chain</h4>
                  <div className="space-y-2">
                    {selectedProtocol.verificationChain.map((verification, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded ${
                          verification.result ? 'bg-green-50' : 'bg-red-50'
                        }`}
                      >
                        <div className="flex justify-between">
                          <span>Validator: {verification.validator}</span>
                          <span>{new Date(verification.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Signature: {verification.signature}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => respondToProtocolMutation.mutate({
                      protocolId: selectedProtocol.id,
                      response: { accepted: true }
                    })}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => respondToProtocolMutation.mutate({
                      protocolId: selectedProtocol.id,
                      response: { accepted: false }
                    })}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => verifyProtocolMutation.mutate(selectedProtocol.id)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIProtocolHandler;
