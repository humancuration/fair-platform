import React from 'react';

interface ResourceExchangeProps {
  groupId: number;
}

const ResourceExchange: React.FC<ResourceExchangeProps> = ({ groupId }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Resource Exchange</h2>
      <div className="space-y-4">
        {/* Add resource exchange functionality here */}
        <p className="text-gray-600">Resource exchange feature coming soon...</p>
      </div>
    </div>
  );
};

export default ResourceExchange;
