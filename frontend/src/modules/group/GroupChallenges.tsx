import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { toast } from 'react-toastify';

interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  reward: string;
}

const GroupChallenges: React.FC<{ groupId: string }> = ({ groupId }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await api.get(`/groups/${groupId}/challenges`);
        setChallenges(response.data);
      } catch (error) {
        console.error('Error fetching challenges:', error);
        toast.error('Failed to load group challenges.');
      }
    };

    fetchChallenges();
  }, [groupId]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Group Challenges</h2>
      {challenges.map((challenge) => (
        <div key={challenge.id} className="mb-4 border-b pb-4">
          <h3 className="text-xl font-semibold">{challenge.title}</h3>
          <p className="text-gray-600">{challenge.description}</p>
          <div className="mt-2">
            <div className="bg-gray-200 h-2 rounded-full">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${challenge.progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">Progress: {challenge.progress}%</p>
          </div>
          <p className="text-sm font-medium mt-2">Reward: {challenge.reward}</p>
        </div>
      ))}
    </div>
  );
};

export default GroupChallenges;
