import React, { useEffect, useState } from 'react';
import api from '@/utils/api';
import { Line } from 'react-chartjs-2';
import GroupEcoAnalyticsData from './GroupEcoAnalyticsData';

interface EcoData {
  date: string;
  savings: number;
  emissionsReduced: number;
}

const EcoAnalytics: React.FC = () => {
  const [ecoData, setEcoData] = useState<EcoData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchEcoData = async () => {
      try {
        const response = await api.get('/eco/analytics'); // Implement this endpoint
        setEcoData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching eco analytics:', err);
        setError('Failed to load eco analytics.');
        setLoading(false);
      }
    };

    fetchEcoData();
  }, []);

  if (loading) return <p>Loading eco analytics...</p>;
  if (error) return <p>Error: {error}</p>;

  const data = {
    labels: ecoData.map((d) => d.date),
    datasets: [
      {
        label: 'Savings ($)',
        data: ecoData.map((d) => d.savings),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
      {
        label: 'Emissions Reduced (kg)',
        data: ecoData.map((d) => d.emissionsReduced),
        borderColor: 'rgba(153,102,255,1)',
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Eco Analytics Over Time</h2>
      <Line data={data} />
      <GroupEcoAnalyticsData />
    </div>
  );
};

export default EcoAnalytics;