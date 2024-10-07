import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AIDashboard: React.FC = () => {
  const [apiUrl, setApiUrl] = useState('https://api.example.com/data');
  const [apiKey, setApiKey] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
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
        <label>
          API Endpoint:
          <input type="text" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} />
        </label>
        <label>
          API Key:
          <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
        </label>
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