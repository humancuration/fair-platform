import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AIDashboard: React.FC = () => {
  const [apiType, setApiType] = useState<'byok' | 'hosted' | 'distributed'>('byok');
  const [apiUrl, setApiUrl] = useState('https://api.example.com/data');
  const [apiKey, setApiKey] = useState('');
  const [hostedService, setHostedService] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
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
      setError(null);
    } catch (err) {
      setError('Failed to fetch data');
    }
  };

  const sentimentCounts = data.reduce((acc: any, item: any) => {
    const sentiment = item.sentiment || 'Neutral';
    acc[sentiment] = (acc[sentiment] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(sentimentCounts),
    datasets: [
      {
        label: 'Sentiment',
        data: Object.values(sentimentCounts),
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(255, 206, 86, 0.6)'],
      },
    ],
  };

  return (
    <div>
      <h1>AI-Powered Analytics Dashboard</h1>
      <div>
        <select value={apiType} onChange={(e) => setApiType(e.target.value as 'byok' | 'hosted' | 'distributed')}>
          <option value="byok">Bring Your Own Key</option>
          <option value="hosted">Hosted Solution</option>
          <option value="distributed">Distributed Solution</option>
        </select>
        {apiType === 'byok' && (
          <>
            <label>
              API Endpoint:
              <input type="text" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} />
            </label>
            <label>
              API Key:
              <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            </label>
          </>
        )}
        {apiType === 'hosted' && (
          <select value={hostedService} onChange={(e) => setHostedService(e.target.value)}>
            <option value="">Select a hosted service</option>
            <option value="service1">Hosted Service 1</option>
            <option value="service2">Hosted Service 2</option>
          </select>
        )}
        <button onClick={fetchData}>Fetch Data</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data.length > 0 && (
        <div>
          <h2>Data Visualization</h2>
          <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>
      )}
    </div>
  );
};

export default AIDashboard;