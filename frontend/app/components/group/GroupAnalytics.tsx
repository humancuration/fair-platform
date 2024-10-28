import React from 'react';

interface GroupAnalyticsProps {
  groupId: string;
}

const GroupAnalytics: React.FC<GroupAnalyticsProps> = ({ groupId }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Analytics</h2>
      {/* Add analytics functionality here */}
      <p className="text-gray-600">Analytics feature coming soon...</p>
    </div>
  );
};

export default GroupAnalytics;
