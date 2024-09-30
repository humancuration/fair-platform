import React, { useEffect, useState } from 'react';
import RecommendationCarousel from '../components/RecommendationCarousel';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../utils/api';

const Home: React.FC = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await api.get('/recommendations');
        setRecommendedProducts(response.data.products);
        setLoading(false);
      } catch (err) {
        // Handle error
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome to Fair Market</h1>
      <RecommendationCarousel products={recommendedProducts} />
      {/* Other homepage content */}
    </div>
  );
};

export default Home;