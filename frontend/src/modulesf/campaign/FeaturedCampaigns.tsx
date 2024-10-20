import React from 'react';
import { Link } from 'react-router-dom';

interface Campaign {
  id: string;
  title: string;
  description: string;
}

const FeaturedCampaigns: React.FC = () => {
  // This would typically fetch data from an API
  const campaigns: Campaign[] = [
    { id: '1', title: 'Save the Rainforest', description: 'Help protect our planet\'s lungs' },
    { id: '2', title: 'Clean Ocean Initiative', description: 'Removing plastic from our oceans' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {campaigns.map((campaign) => (
        <Link key={campaign.id} to={`/campaigns/${campaign.id}`} className="block p-4 border rounded hover:bg-gray-100">
          <h3 className="text-xl font-semibold">{campaign.title}</h3>
          <p>{campaign.description}</p>
        </Link>
      ))}
    </div>
  );
};

export default FeaturedCampaigns;
