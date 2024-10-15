import React, { useState, useEffect } from 'react';
import api from '@api/api';

const GroupSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await api.get(`/groups/recommend?query=${searchTerm}`);
        setRecommendations(response.data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    if (searchTerm) {
      fetchRecommendations();
    }
  }, [searchTerm]);

  return (
    <div>
      <input 
        type="text" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for groups..."
      />
      {/* Render recommendations */}
    </div>
  );
};

export default GroupSearch;