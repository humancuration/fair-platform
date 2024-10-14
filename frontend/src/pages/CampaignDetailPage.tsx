import React from 'react';
import CampaignDetail from '../components/CampaignDetail';
import { useParams } from 'react-router-dom';

const CampaignDetailPage: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();

  if (!campaignId) {
    return <div className="text-center text-red-500">Campaign ID is missing</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <CampaignDetail campaignId={campaignId} />
    </div>
  );
};

export default CampaignDetailPage;
