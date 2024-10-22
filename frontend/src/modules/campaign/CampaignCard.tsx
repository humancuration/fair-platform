import React from 'react';

interface CampaignCardProps {
  campaign: any;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  return (
    <div>
      <h2>{campaign.name}</h2>
      <p>{campaign.description}</p>
      <p>Goal: {campaign.goal}</p>
      <p>Progress: {campaign.progress}</p>
    </div>
  );
};

export default CampaignCard;