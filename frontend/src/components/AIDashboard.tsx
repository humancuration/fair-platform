import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useToast } from '../hooks/useToast';
import Button from './common/Button';
import Spinner from './common/Spinner';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type ApiType = 'byok' | 'hosted' | 'distributed';

const AIDashboard: React.FC = () => {
  const [apiType, setApiType] = useState<ApiType>('byok');
  const [apiUrl, setApiUrl] = useState('https://api.example.com/data');
  const [apiKey, setApiKey] = useState('');
  const [hostedService, setHostedService] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (apiType === 'byok' && (!apiUrl || !apiKey)) {
      toast.warning('Please provide both API URL and API Key for BYOK option.');
    }
  }, [apiType, apiUrl, apiKey, toast]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      switch (apiType) {
        case 'byok':
          response = await axios.get(apiUrl, {
            headers: { Authorization: `Bearer ${apiKey}` },
          });
          break;
        case 'hosted':
          response = await axios.get(`/api/hosted-ai/${hostedService}`);
          break;
        case 'distributed':
          response = await axios.get('/api/distributed-ai');
          break;
      }
      setData(response.data);
      toast.success('Data fetched successfully');
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [apiType, apiUrl, apiKey, hostedService, toast]);

  const chartData = React.useMemo(() => {
    const sentimentCounts = data.reduce((acc: Record<string, number>, item: any) => {
      const sentiment = item.sentiment || 'Neutral';
      acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(sentimentCounts),
      datasets: [
        {
          label: 'Sentiment',
          data: Object.values(sentimentCounts),
          backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(255, 206, 86, 0.6)'],
        },
      ],
    };
  }, [data]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI-Powered Analytics Dashboard</h1>
      <div className="mb-4">
        <select 
          value={apiType} 
          onChange={(e) => setApiType(e.target.value as ApiType)}
          className="w-full p-2 border rounded mb-2"
        >
          <option value="byok">Bring Your Own Key</option>
          <option value="hosted">Hosted Solution</option>
          <option value="distributed">Distributed Solution</option>
        </select>
        {apiType === 'byok' && (
          <>
            <input
              type="text"
              placeholder="API Endpoint"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="password"
              placeholder="API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
          </>
        )}
        {apiType === 'hosted' && (
          <select
            value={hostedService}
            onChange={(e) => setHostedService(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          >
            <option value="">Select a hosted service</option>
            <option value="service1">Hosted Service 1</option>
            <option value="service2">Hosted Service 2</option>
          </select>
        )}
        <Button onClick={fetchData} disabled={loading}>
          {loading ? <Spinner size="sm" /> : 'Fetch Data'}
        </Button>
      </div>
      {data.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Data Visualization</h2>
          <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>
      )}
    </div>
  );
};

export default React.memo(AIDashboard);