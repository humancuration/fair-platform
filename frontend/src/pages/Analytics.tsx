import React, { useEffect, useState, useContext, useMemo } from 'react';
import axios, { AxiosResponse } from 'axios';
import { AuthContext } from '../contexts/AuthContext';

interface AnalyticsData {
  totalProducts: number;
  totalRevenue: number;
  averageGenerosity: number;
}

const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const { token } = useContext(AuthContext);
  const companyId = 1; // Replace with dynamic company ID based on user

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res: AxiosResponse<AnalyticsData> = await axios.get(`/api/analytics/company/${companyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [token, companyId]);

  const totalDividends = useMemo(() => {
    return data ? data.totalRevenue / data.totalProducts : 0;
  }, [data]);

  if (loading) return <p>Loading analytics...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  if (!data) return <p>Loading analytics...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">Company Analytics</h1>
      <div className="bg-white shadow-md rounded p-6">
        <p><strong>Total Products:</strong> {data.totalProducts}</p>
        <p><strong>Total Revenue:</strong> ${data.totalRevenue.toFixed(2)}</p>
        <p><strong>Average Generosity Score:</strong> {data.averageGenerosity}</p>
      </div>
    </div>
  );
};

export default Analytics;