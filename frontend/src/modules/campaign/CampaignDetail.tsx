import React from 'react';

interface CampaignDetailProps {
  campaignId: string;
}

const CampaignDetail: React.FC<CampaignDetailProps> = ({ campaignId }) => {
  return <div>Campaign Detail: {campaignId}</div>;
};

export default CampaignDetail;