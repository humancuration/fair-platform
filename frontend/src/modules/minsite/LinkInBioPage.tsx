// frontend/src/pages/LinkInBioPage.tsx

import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';

interface AffiliateProgram {
  id: number;
  name: string;
  commissionRate: number;
}

interface AffiliateLink {
  id: number;
  generatedLink: string;
  customAlias: string;
  affiliateProgram: AffiliateProgram;
  clicks: number;
  conversions: number;
}

const LinkInBioPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();

  const { data: affiliateLinks, isLoading, error } = useQuery<AffiliateLink[]>(
    ['affiliateLinks', username],
    () => api.get(`/affiliate/links`, { params: { username } }).then(res => res.data)
  );

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error fetching affiliate links</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center p-4"
    >
      <h1 className="text-3xl font-bold mb-6">{username}'s Links</h1>
      <div className="space-y-4 w-full max-w-md">
        {affiliateLinks?.map((link, index) => (
          <motion.a
            key={link.id}
            href={link.generatedLink}
            className="block w-full bg-blue-500 text-white text-center py-3 rounded shadow hover:bg-blue-600 transition"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {link.customAlias || link.affiliateProgram.name}
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};

export default LinkInBioPage;
