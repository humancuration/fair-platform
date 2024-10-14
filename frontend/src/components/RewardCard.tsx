import React from 'react';
import api from '@api/api';
import { Reward } from '../models/Reward';

interface RewardCardProps {
  reward: Reward;
}

const RewardCard: React.FC<RewardCardProps> = ({ reward }) => {
  const redeemReward = async () => {
    try {
      await api.redeemReward(reward.id.toString());
      alert('Reward redeemed successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to redeem reward.');
    }
  };

  return (
    <div className="reward-card">
      <h2>{reward.title}</h2>
      <p>{reward.description}</p>
      <p>Points Required: {reward.amount}</p>
      <button onClick={redeemReward}>Redeem</button>
    </div>
  );
};

export default RewardCard;
