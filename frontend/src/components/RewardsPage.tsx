import React, { useEffect, useState } from 'react';
import api from '@api/api';
import RewardCard from './RewardCard';
import { Reward } from '../models/Reward';

const RewardsPage: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await api.get<Reward[]>('/rewards');
        setRewards(response.data);
      } catch (error) {
        console.error('Failed to fetch rewards:', error);
        // Consider adding user-friendly error handling here
      }
    };
    fetchRewards();
  }, []);

  return (
    <div>
      <h1>Your Rewards</h1>
      <div className="rewards-container">
        {rewards.map((reward) => (
          <RewardCard key={reward.id} reward={reward} />
        ))}
      </div>
    </div>
  );
};

export default RewardsPage;