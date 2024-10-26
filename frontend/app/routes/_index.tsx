import { json, type LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { motion } from 'framer-motion';
import RecommendationCarousel from '~/components/RecommendationCarousel';
import FeaturedCampaigns from '~/components/campaigns/FeaturedCampaigns';
import CommunityHighlights from '~/components/CommunityHighlights';
import EcoTips from '~/components/eco/EcoTips';
import { getRecommendations } from '~/services/recommendations.server';
import type { Product } from '~/types';
import { Link } from '@remix-run/react';

interface LoaderData {
  recommendations: Product[];
}

export const loader: LoaderFunction = async () => {
  const recommendations = await getRecommendations({ limit: 10 });
  return json<LoaderData>({ recommendations });
};

export default function Index() {
  const { recommendations } = useLoaderData<typeof loader>();

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
}
