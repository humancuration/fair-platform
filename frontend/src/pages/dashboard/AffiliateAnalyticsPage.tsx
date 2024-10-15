// frontend/src/pages/AffiliateAnalyticsPage.tsx

import React, { useEffect, useState, useMemo } from 'react';
import api from '@api/api';
import { Bar } from 'react-chartjs-2';
import { AxiosResponse } from 'axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme'; // Assuming you have a useTheme hook

interface AffiliateLink {
  id: number;
  customAlias: string;
  clicks: number;
  conversions: number;
  commissionEarned: number;
}

interface APIResponseLink {
  id: number;
  customAlias: string;
  clicks: number;
  conversions: number;
  affiliateProgram: {
    commissionRate: number;
    name: string;
  };
}

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2.5rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SortDropdown = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const FilterDropdown = styled(SortDropdown)``;

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

const AffiliateAnalyticsPage: React.FC = () => {
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof AffiliateLink; direction: 'ascending' | 'descending' } | null>(null);
  const { theme } = useTheme();

  const fetchAffiliateLinks = async () => {
    try {
      setLoading(true);
      const response: AxiosResponse<APIResponseLink[]> = await api.get('/affiliate/links');
      const links = response.data.map((link) => ({
        id: link.id,
        customAlias: link.customAlias || link.affiliateProgram.name,
        clicks: link.clicks,
        conversions: link.conversions,
        commissionEarned: link.conversions * (link.affiliateProgram.commissionRate / 100),
      }));
      setAffiliateLinks(links);
    } catch (error) {
      console.error('Error fetching affiliate links', error);
      setError('Failed to load affiliate analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAffiliateLinks();
  }, []);

  const sortedAffiliateLinks = useMemo(() => {
    if (!sortConfig) return affiliateLinks;
    return [...affiliateLinks].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });
  }, [affiliateLinks, sortConfig]);

  const handleSort = (key: keyof AffiliateLink) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig?.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending',
    }));
  };

  const data = {
    labels: affiliateLinks.map((link) => link.customAlias),
    datasets: [
      {
        label: 'Clicks',
        data: affiliateLinks.map((link) => link.clicks),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Conversions',
        data: affiliateLinks.map((link) => link.conversions),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Commission Earned ($)',
        data: affiliateLinks.map((link) => link.commissionEarned),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  if (loading) return <div>Loading affiliate analytics...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={`min-h-screen ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
      }`}
    >
      <PageContainer>
        <Header>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Affiliate Analytics
          </motion.h1>
        </Header>
        <ControlsContainer>
          <SortDropdown onChange={(e) => handleSort(e.target.value as keyof AffiliateLink)}>
            <option value="">Sort by</option>
            <option value="clicks">Clicks</option>
            <option value="conversions">Conversions</option>
            <option value="commissionEarned">Commission Earned</option>
          </SortDropdown>
          {/* Add FilterDropdown if needed */}
        </ControlsContainer>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="mb-6">
            <Bar data={data} />
          </div>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Affiliate Link</th>
                <th className="py-2">Clicks</th>
                <th className="py-2">Conversions</th>
                <th className="py-2">Commission Earned ($)</th>
              </tr>
            </thead>
            <tbody>
              {sortedAffiliateLinks.map((link) => (
                <tr key={link.id} className="text-center">
                  <td className="py-2">{link.customAlias}</td>
                  <td className="py-2">{link.clicks}</td>
                  <td className="py-2">{link.conversions}</td>
                  <td className="py-2">{link.commissionEarned.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </PageContainer>
    </motion.div>
  );
};

export default AffiliateAnalyticsPage;
