import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RecommendationCarousel from '../components/RecommendationCarousel';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../api/api';
import FeaturedCampaigns from '../modules/campaign/FeaturedCampaigns';
import CommunityHighlights from '../components/CommunityHighlights';
import EcoTips from '../modules/eco/EcoTips';
import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { motion } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { GET_RECOMMENDATIONS } from '../graphql/queries';
import type { Product, Campaign } from '../types';

interface LoaderData {
  initialRecommendations: Product[];
}

export const loader: LoaderFunction = async () => {
  // Server-side data fetching with Remix
  const initialRecommendations = await getInitialRecommendations();
  return json<LoaderData>({ initialRecommendations });
};

const Home: React.FC = () => {
  const { initialRecommendations } = useLoaderData<LoaderData>();
  
  // Client-side data fetching with Apollo
  const { data: recommendationsData } = useQuery(GET_RECOMMENDATIONS, {
    variables: { limit: 10 },
  });

  const recommendations = recommendationsData?.recommendations || initialRecommendations;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4"
    >
      <h1 className="text-3xl font-bold mb-6">Welcome to Fair Market</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Recommended Products</h2>
        <RecommendationCarousel products={recommendations} />
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Featured Campaigns</h2>
        <FeaturedCampaigns />
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Community Highlights</h2>
        <CommunityHighlights />
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Eco Tips</h2>
        <EcoTips />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/directory" className="bg-green-500 text-white p-4 rounded text-center hover:bg-green-600 transition">
          Explore Company Directory
        </Link>
        <Link to="/forums" className="bg-blue-500 text-white p-4 rounded text-center hover:bg-blue-600 transition">
          Join Community Forums
        </Link>
        <Link to="/campaigns" className="bg-purple-500 text-white p-4 rounded text-center hover:bg-purple-600 transition">
          View All Campaigns
        </Link>
        <Link to="/community-wishlist" className="bg-yellow-500 text-white p-4 rounded text-center hover:bg-yellow-600 transition">
          Community Wishlist
        </Link>
      </section>
    </motion.div>
  );
};

export default Home;
