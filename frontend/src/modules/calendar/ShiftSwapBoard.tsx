import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'react-query';
import api from '../../api/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { FaExchangeAlt, FaCheck, FaTimes } from 'react-icons/fa';

interface ShiftSwap {
  id: string;
  requesterId: string;
  requesterName: string;
  originalShift: {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    role: string;
  };
  desiredShift: {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    role: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const ShiftSwapBoard: React.FC<{ groupId: string }> = ({ groupId }) => {
  const { data: swaps, isLoading } = useQuery<ShiftSwap[]>(
    ['shiftSwaps', groupId],
    () => api.get(`/groups/${groupId}/shift-swaps`).then(res => res.data)
  );

  const approveMutation = useMutation(
    (swapId: string) => api.post(`/groups/${groupId}/shift-swaps/${swapId}/approve`),
    {
      onSuccess: () => {
        toast.success('Shift swap approved');
      },
      onError: () => {
        toast.error('Failed to approve shift swap');
      },
    }
  );

  const rejectMutation = useMutation(
    (swapId: string) => api.post(`/groups/${groupId}/shift-swaps/${swapId}/reject`),
    {
      onSuccess: () => {
        toast.success('Shift swap rejected');
      },
      onError: () => {
        toast.error('Failed to reject shift swap');
      },
    }
  );

  if (isLoading) return <div>Loading shift swaps...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Shift Swap Board</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold mb-4">Pending Swaps</h3>
          <AnimatePresence>
            {swaps?.filter(swap => swap.status === 'pending').map(swap => (
              <motion.div
                key={swap.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border rounded-lg p-4 mb-4"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-medium">{swap.requesterName}</p>
                    <p className="text-sm text-gray-500">
                      Requested {format(new Date(swap.createdAt), 'PPp')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveMutation.mutate(swap.id)}
                      className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => rejectMutation.mutate(swap.id)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Original Shift</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(swap.originalShift.date), 'PP')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {swap.originalShift.startTime} - {swap.originalShift.endTime}
                    </p>
                    <p className="text-sm text-gray-600">
                      Role: {swap.originalShift.role}
                    </p>
                  </div>

                  <FaExchangeAlt className="text-gray-400" />

                  <div className="flex-1">
                    <p className="text-sm font-medium">Desired Shift</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(swap.desiredShift.date), 'PP')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {swap.desiredShift.startTime} - {swap.desiredShift.endTime}
                    </p>
                    <p className="text-sm text-gray-600">
                      Role: {swap.desiredShift.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {swaps?.filter(swap => swap.status !== 'pending')
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 5)
              .map(swap => (
                <div
                  key={swap.id}
                  className={`p-4 rounded-lg ${
                    swap.status === 'approved' ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{swap.requesterName}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(swap.createdAt), 'PPp')}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        swap.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {swap.status}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ShiftSwapBoard;
