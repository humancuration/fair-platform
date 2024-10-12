import React, { useEffect, useState } from 'react';
import api from '@api/api';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const Recommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState([]);
  const userId = useSelector((state: RootState) => state.user.id);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await api.get('/ai/recommendations', {
          params: { user_id: userId },
        });
        setRecommendations(response.data.recommendations);
      } catch (error) {
        // Handle error
      }
    };
    fetchRecommendations();
  }, [userId]);

  return (
    <div>
      <h2>Your Recommendations</h2>
      <ul>
        {recommendations.map((productId) => (
          <li key={productId}>Product ID: {productId}</li>
        ))}
      </ul>
    </div>
  );
};

export default Recommendations;
