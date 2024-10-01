import React from 'react';
import api from '../services/api';
import { Reward } from '../../../backend/src/models/Reward';

interface RewardCardProps {
  reward: Reward;
}

const RewardCard: React.FC<RewardCardProps> = ({ reward }) => {
  const redeemReward = async () => {
    try {
      await api.post('/rewards/redeem', { rewardId: reward.id });
      alert('Reward redeemed successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to redeem reward.');
    }
  };

  return (
    <div className="reward-card">
      <h2>{reward.name}</h2>
      <p>{reward.description}</p>
      <p>Points Required: {reward.points_required}</p>
      <button onClick={redeemReward}>Redeem</button>
    </div>
  );
};

export default RewardCard;