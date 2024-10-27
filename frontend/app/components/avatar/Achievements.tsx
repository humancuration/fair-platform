import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface AchievementsProps {
  userId: string;
}

const Achievements: FC<AchievementsProps> = ({ userId }) => {
  const { data: achievements, isError } = useQuery<Achievement[]>({
    queryKey: ['achievements', userId],
    queryFn: async () => {
      const response = await fetch(`/api/achievements/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch achievements');
      return response.json();
    }
  });

  if (isError) {
    return <div>Error loading achievements</div>;
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold">Achievements</h3>
      <div className="grid grid-cols-3 gap-2">
        {achievements?.map(achievement => (
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
