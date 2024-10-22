import React, { useState } from 'react';
import api from '@/utils/api';

interface GroupPromotionProps {
  groupId: string;
}

const GroupPromotion: React.FC<GroupPromotionProps> = ({ groupId }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/groups/${groupId}/promote`, { content });
      // Handle successful promotion
    } catch (error) {
      console.error('Error promoting group:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea 
        value={content} 
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your promotional content here..."
      />
      <button type="submit">Promote Group</button>
    </form>
  );
};

export default GroupPromotion;