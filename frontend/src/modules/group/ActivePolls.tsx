import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PollWidget from '../poll/PollWidget';
import api from '@/utils/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface Poll {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
  totalVotes: number;
  createdAt: string;
  endsAt: string;
  createdBy: {
    id: string;
    username: string;
    avatar: string;
  };
}

interface ActivePollsProps {
  groupId: string;
}

const ActivePolls: React.FC<ActivePollsProps> = ({ groupId }) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPoll, setSelectedPoll] = useState<string | null>(null);

  useEffect(() => {
    fetchPolls();
    // Set up polling interval for real-time updates
    const interval = setInterval(fetchPolls, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [groupId]);

  const fetchPolls = async () => {
    try {
      const response = await api.get(`/groups/${groupId}/polls/active`);
      setPolls(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching polls:', err);
      setError('Failed to load active polls');
      toast.error('Failed to load active polls');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePoll = () => {
    // Implement poll creation logic
    toast.info('Poll creation coming soon!');
  };

  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="bg-white shadow-lg rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Active Polls</h2>
        <button
          onClick={handleCreatePoll}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Create Poll
        </button>
      </div>

      <AnimatePresence>
        {polls.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <p className="text-gray-500">No active polls at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Create one to get started!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {polls.map((poll) => (
              <motion.div
                key={poll.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedPoll(poll.id)}
                className="cursor-pointer"
              >
                <PollWidget
                  key={poll.id}
                  pollData={{
                    id: poll.id,
                    question: poll.question,
                    options: poll.options,
                    totalVotes: poll.totalVotes
                  }}
                />
                
                <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <img
                      src={poll.createdBy.avatar}
                      alt={poll.createdBy.username}
                      className="w-6 h-6 rounded-full"
                    />
                    <span>Created by {poll.createdBy.username}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>
                      Created: {new Date(poll.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      Ends: {new Date(poll.endsAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ActivePolls;
