// frontend/src/pages/LinkInBioPage.tsx

import React, { useEffect, useState } from 'react';
import api from '@/utils/api';
import { useParams } from 'react-router-dom';

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
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([]);

  const fetchAffiliateLinks = async () => {
    try {
      const response = await api.get(`/affiliate/links`, {
        params: { username },
      });
      setAffiliateLinks(response.data);
    } catch (error) {
      console.error('Error fetching affiliate links', error);
    }
  };

  useEffect(() => {
    fetchAffiliateLinks();
  }, [username]);

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">{username}'s Links</h1>
      <div className="space-y-4 w-full max-w-md">
        {affiliateLinks.map((link) => (
          <a
            key={link.id}
            href={link.generatedLink}
            className="w-full bg-blue-500 text-white text-center py-3 rounded shadow hover:bg-blue-600 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.customAlias || link.affiliateProgram.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default LinkInBioPage;
