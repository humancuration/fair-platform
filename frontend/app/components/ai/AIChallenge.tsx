import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { FaTrophy, FaClock, FaUsers } from 'react-icons/fa';
import api from '@/utils/api';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  participants: number;
  deadline: string;
  rewards: {
    points: number;
    badges: string[];
  };
}

const AIChallenge: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const { data: challenges } = useQuery('aiChallenges', () =>
    api.get('/ai/challenges').then(res => res.data)
  );

  const joinChallengeMutation = useMutation(
    (challengeId: string) => api.post(`/ai/challenges/${challengeId}/join`),
    {
      onSuccess: () => {
        // Handle success
      }
    }
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">AI Challenges</h1>
        <div className="flex gap-4">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges?.filter(c => selectedDifficulty === 'all' || c.difficulty === selectedDifficulty)
          .map((challenge: Challenge) => (
          <motion.div
            key={challenge.id}
            whileHover={{ y: -5 }}
            className="border rounded-lg p-6 bg-white shadow-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{challenge.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm ${
                challenge.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                challenge.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {challenge.difficulty}
              </span>
            </div>

            <p className="text-gray-600 mb-4">{challenge.description}</p>

            <div className="flex gap-4 mb-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <FaClock />
                <span>Ends: {new Date(challenge.deadline).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaUsers />
                <span>{challenge.participants} participants</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <FaTrophy className="text-yellow-500" />
                  <span>{challenge.rewards.points} points</span>
                </div>
                <div className="flex gap-2 mt-2">
                  {challenge.rewards.badges.map(badge => (
                    <span key={badge} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => joinChallengeMutation.mutate(challenge.id)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Join Challenge
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AIChallenge;
