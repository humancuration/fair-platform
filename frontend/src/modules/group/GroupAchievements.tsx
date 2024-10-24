import React from 'react';

interface GroupAchievementsProps {
  groupId: string;
}

const GroupAchievements: React.FC<GroupAchievementsProps> = ({ groupId }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Achievements</h2>
      {/* Add achievements functionality here */}
      <p className="text-gray-600">Achievements feature coming soon...</p>
    </div>
  );
};

export default GroupAchievements;
