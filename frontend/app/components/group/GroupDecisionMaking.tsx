import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { toast } from 'react-toastify';

interface Decision {
  id: string;
  title: string;
  description: string;
  options: { id: string; text: string; votes: number }[];
  deadline: string;
}

const GroupDecisionMaking: React.FC<{ groupId: string }> = ({ groupId }) => {
  const [decisions, setDecisions] = useState<Decision[]>([]);

  useEffect(() => {
    const fetchDecisions = async () => {
      try {
        const response = await api.get(`/groups/${groupId}/decisions`);
        setDecisions(response.data);
      } catch (error) {
        console.error('Error fetching decisions:', error);
        toast.error('Failed to load group decisions.');
      }
    };

    fetchDecisions();
  }, [groupId]);

  const handleVote = async (decisionId: string, optionId: string) => {
    try {
      await api.post(`/groups/${groupId}/decisions/${decisionId}/vote`, { optionId });
      toast.success('Vote cast successfully!');
      // Refresh decisions after voting
      const response = await api.get(`/groups/${groupId}/decisions`);
      setDecisions(response.data);
    } catch (error) {
      console.error('Error casting vote:', error);
      toast.error('Failed to cast vote.');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Group Decisions</h2>
      {decisions.map((decision) => (
        <div key={decision.id} className="mb-6 border-b pb-4">
          <h3 className="text-xl font-semibold">{decision.title}</h3>
          <p className="text-gray-600">{decision.description}</p>
          <p className="text-sm text-gray-500 mt-2">Deadline: {new Date(decision.deadline).toLocaleString()}</p>
          <div className="mt-4">
            {decision.options.map((option) => (
              <div key={option.id} className="flex items-center justify-between mb-2">
                <span>{option.text}</span>
                <div>
                  <span className="mr-4">{option.votes} votes</span>
                  <button
                    onClick={() => handleVote(decision.id, option.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition duration-300"
                  >
                    Vote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupDecisionMaking;
