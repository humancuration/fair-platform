import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
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

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`/api/analytics/company/${companyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch analytics');
      }
    };
    fetchAnalytics();
  }, [token, companyId]);

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
