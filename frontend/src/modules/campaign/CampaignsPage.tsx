import React, { useState, useCallback, Suspense } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CAMPAIGNS } from '../../graphql/queries';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorBoundary from '../../components/ErrorBoundary';
import { useToast } from '../../hooks/useToast';

const CampaignList = React.lazy(() => import('./CampaignList'));

const CampaignsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();
  const { loading, error, data } = useQuery(GET_CAMPAIGNS);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const filteredCampaigns = React.useMemo(() => {
    if (!data?.campaigns) return [];
    return data.campaigns.filter((campaign) =>
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  if (loading) return <LoadingSpinner />;
  if (error) {
    showToast('Error loading campaigns', 'error');
    return <div>Error loading campaigns. Please try again later.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-semibold mb-6">All Campaigns</h1>
      <input
        type="text"
        placeholder="Search campaigns..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full p-2 mb-4 border rounded"
      />
      <ErrorBoundary fallback={<div>Something went wrong. Please try again.</div>}>
        <Suspense fallback={<LoadingSpinner />}>
          <CampaignList campaigns={filteredCampaigns} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default React.memo(CampaignsPage);
