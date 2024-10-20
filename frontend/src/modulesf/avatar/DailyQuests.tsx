import React, { useState, useEffect } from 'react';
import api from '../../api/api';

interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
}

const DailyQuests: React.FC<{ userId: string }> = ({ userId }) => {
  const [quests, setQuests] = useState<Quest[]>([]);

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    try {
      const response = await api.get(`/quests/${userId}`);
      setQuests(response.data);
    } catch (error) {
      console.error('Error fetching quests:', error);
    }
  };

  const completeQuest = async (questId: string) => {
    try {
      await api.post(`/quests/${userId}/complete`, { questId });
      fetchQuests();
    } catch (error) {
      console.error('Error completing quest:', error);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold">Daily Quests</h3>
      <ul>
        {quests.map((quest) => (
          <li key={quest.id} className="mb-2">
            <h4 className="font-semibold">{quest.title}</h4>
            <p>{quest.description}</p>
            <p>Reward: {quest.reward} XP</p>
            {!quest.completed && (
              <button
                onClick={() => completeQuest(quest.id)}
                className="bg-blue-500 text-white px-2 py-1 rounded mt-1"
              >
                Complete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DailyQuests;
