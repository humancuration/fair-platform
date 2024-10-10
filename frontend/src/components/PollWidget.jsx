import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './PollWidget.css';

const PollWidget = () => {
  const [pollData, setPollData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        const response = await api.get('/polls/current');
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
