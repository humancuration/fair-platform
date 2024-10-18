import React, { useState, useEffect } from 'react';
import api from '../../api/api';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const Achievements: React.FC<{ userId: string }> = ({ userId }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await api.get(`/achievements/${userId}`);
        setAchievements(response.data);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      }
    };

    fetchAchievements();
  }, [userId]);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold">Achievements</h3>
      <div className="grid grid-cols-3 gap-2">
        {achievements.map(achievement => (
          <div key={achievement.id} className="border p-2 rounded">
            <img src={achievement.icon} alt={achievement.name} className="w-8 h-8 mx-auto" />
            <h4 className="font-semibold text-center">{achievement.name}</h4>
            <p className="text-sm text-center">{achievement.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
