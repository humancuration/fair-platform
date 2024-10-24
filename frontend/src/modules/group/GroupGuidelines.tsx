import React from 'react';

interface GroupGuidelinesProps {
  groupId: string;
}

const GroupGuidelines: React.FC<GroupGuidelinesProps> = ({ groupId }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Guidelines</h2>
      {/* Add guidelines functionality here */}
      <p className="text-gray-600">Guidelines feature coming soon...</p>
    </div>
  );
};

export default GroupGuidelines;
