import React from 'react';
import CampaignList from '../components/CampaignList';

const CampaignsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-semibold mb-6">All Campaigns</h1>
      <CampaignList />
    </div>
  );
};

export default CampaignsPage;