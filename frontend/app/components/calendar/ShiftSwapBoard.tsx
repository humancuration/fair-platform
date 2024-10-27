import type { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Form, useNavigation } from '@remix-run/react';
import { format } from 'date-fns';
import { FaExchangeAlt, FaCheck, FaTimes, FaClock, FaUserAlt } from 'react-icons/fa';

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

interface ShiftSwapBoardProps {
  groupId: string;
  swaps: ShiftSwap[];
}

export const ShiftSwapBoard: FC<ShiftSwapBoardProps> = ({ groupId, swaps }) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const pendingSwaps = swaps.filter(swap => swap.status === 'pending');
  const recentActivity = swaps
    .filter(swap => swap.status !== 'pending')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

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
            {pendingSwaps.map(swap => (
              <motion.div
                key={swap.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border rounded-lg p-4 mb-4"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <FaUserAlt className="text-gray-400" />
                      <p className="font-medium">{swap.requesterName}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FaClock className="text-gray-400" />
                      <p>Requested {format(new Date(swap.createdAt), 'PPp')}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Form method="post">
                      <input type="hidden" name="intent" value="approve" />
                      <input type="hidden" name="swapId" value={swap.id} />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:bg-green-300 transition"
                        title="Approve swap"
                      >
                        <FaCheck />
                      </button>
                    </Form>

                    <Form method="post">
                      <input type="hidden" name="intent" value="reject" />
                      <input type="hidden" name="swapId" value={swap.id} />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:bg-red-300 transition"
                        title="Reject swap"
                      >
                        <FaTimes />
                      </button>
                    </Form>
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

                  <FaExchangeAlt className="text-gray-400 flex-shrink-0" />

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
            {pendingSwaps.length === 0 && (
              <p className="text-gray-500 text-center py-4">No pending swap requests</p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map(swap => (
              <div
                key={swap.id}
                className={`p-4 rounded-lg ${
                  swap.status === 'approved' ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <FaUserAlt className="text-gray-400" />
                      <p className="font-medium">{swap.requesterName}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FaClock className="text-gray-400" />
                      <p>{format(new Date(swap.createdAt), 'PPp')}</p>
                    </div>
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
            {recentActivity.length === 0 && (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
