import React, { useState, useEffect } from 'react';
import api from '@api/api';
import './PollWidget.css';

interface PollOption {
  id: string;
  text: string;
}

interface PollData {
  question: string;
  options: PollOption[];
}

const PollWidget: React.FC = () => {
  const [pollData, setPollData] = useState<PollData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        const response = await api.get<PollData>('/polls/current');
        setPollData(response.data);
      } catch (err) {
        console.error('Error fetching poll data:', err);
        setError('Failed to load poll data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPollData();
  }, []);

  if (loading) return <div className="poll-widget">Loading poll...</div>;
  if (error) return <div className="poll-widget error">{error}</div>;
  if (!pollData) return null;

  return (
    <div className="poll-widget">
      <h2>{pollData.question}</h2>
      <ul>
        {pollData.options.map((option) => (
          <li key={option.id}>
            <button>{option.text}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PollWidget;
