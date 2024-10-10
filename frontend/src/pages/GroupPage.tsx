import React from 'react';
import CampaignList from '../components/CampaignList';

const GroupPage: React.FC = () => {
  return (
    <div>
      {/* Other group details */}
      <h2 className="text-2xl font-semibold mt-6">Active Campaigns</h2>
      <CampaignList categoryFilter="Art" limit={5} />
    </div>
  );
};

export default GroupPage;