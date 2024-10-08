// frontend/src/pages/AffiliateAnalyticsPage.tsx

import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Bar } from 'react-chartjs-2';

interface AffiliateLink {
  id: number;
  customAlias: string;
  clicks: number;
  conversions: number;
  commissionEarned: number;
}

const AffiliateAnalyticsPage: React.FC = () => {
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([]);

  const fetchAffiliateLinks = async () => {
    try {
      const response = await api.get('/affiliate/links');
      const links = response.data.map((link: any) => ({
        id: link.id,
        customAlias: link.customAlias || link.affiliateProgram.name,
        clicks: link.clicks,
        conversions: link.conversions,
        commissionEarned: link.conversions * (link.affiliateProgram.commissionRate / 100),
      }));
      setAffiliateLinks(links);
    } catch (error) {
      console.error('Error fetching affiliate links', error);
    }
  };

  useEffect(() => {
    fetchAffiliateLinks();
  }, []);

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Affiliate Analytics</h1>
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
          {affiliateLinks.map((link) => (
            <tr key={link.id} className="text-center">
              <td className="py-2">{link.customAlias}</td>
              <td className="py-2">{link.clicks}</td>
              <td className="py-2">{link.conversions}</td>
              <td className="py-2">{link.commissionEarned.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AffiliateAnalyticsPage;
