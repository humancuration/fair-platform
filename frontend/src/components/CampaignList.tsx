import React, { useEffect, useState } from 'react';
import api from '@api/api';
import CampaignCard from './CampaignCard';

interface Campaign {
  _id: string;
  title: string;
  description: string;
  goal: number;
  amountRaised: number;
  deadline: string;
  creator: {
    username: string;
  };
  category: string;
  image: string;
}

interface CampaignListProps {
  categoryFilter?: string;
  limit?: number;
}

const CampaignList: React.FC<CampaignListProps> = ({ categoryFilter, limit = 10 }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        let query = '';
        if (categoryFilter) {
          query = `?category=${encodeURIComponent(categoryFilter)}`;
        }
        const response = await api.get(`/campaigns${query}`);
        setCampaigns(response.data.slice(0, limit));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [categoryFilter, limit]);

  if (loading) {
    return <p>Loading campaigns...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign._id} campaign={campaign} />
      ))}
    </div>
  );
};

export default CampaignList;