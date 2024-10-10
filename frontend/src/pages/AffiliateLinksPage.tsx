// frontend/src/pages/AffiliateLinksPage.tsx

import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { exportAsStatic } from '../utils/staticExport'; // Import the export function

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

const AffiliateLinksPage: React.FC = () => {
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([]);
  const [affiliatePrograms, setAffiliatePrograms] = useState<AffiliateProgram[]>([]);
  const [originalLink, setOriginalLink] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
  const [customAlias, setCustomAlias] = useState('');

  const fetchAffiliateLinks = async () => {
    try {
      const response = await api.get('/affiliate/links');
      setAffiliateLinks(response.data);
    } catch (error) {
      console.error('Error fetching affiliate links', error);
    }
  };

  const fetchAffiliatePrograms = async () => {
    try {
      const response = await api.get('/affiliate/programs'); // You need to implement this endpoint
      setAffiliatePrograms(response.data);
    } catch (error) {
      console.error('Error fetching affiliate programs', error);
    }
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgram || !originalLink) return;

    try {
      const response = await api.post('/affiliate/links', {
        affiliateProgramId: selectedProgram,
        originalLink,
        customAlias,
      });
      setAffiliateLinks([...affiliateLinks, response.data]);
      setOriginalLink('');
      setCustomAlias('');
    } catch (error) {
      console.error('Error creating affiliate link', error);
    }
  };

  const handleStaticExport = () => {
    exportAsStatic();
  };

  useEffect(() => {
    fetchAffiliateLinks();
    fetchAffiliatePrograms();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Affiliate Links</h1>
      
      <form onSubmit={handleCreateLink} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Select Affiliate Program</label>
          <select
            value={selectedProgram || ''}
            onChange={(e) => setSelectedProgram(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="" disabled>Select a program</option>
            {affiliatePrograms.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name} ({program.commissionRate}% commission)
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Original Link</label>
          <input
            type="url"
            value={originalLink}
            onChange={(e) => setOriginalLink(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="https://example.com/product"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Custom Alias (Optional)</label>
          <input
            type="text"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g., Shop Now"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Affiliate Link
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-4">Your Affiliate Links</h2>
      <div className="space-y-4">
        {affiliateLinks.map((link) => (
          <div key={link.id} className="p-4 border rounded">
            <a href={link.generatedLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              {link.customAlias || link.affiliateProgram.name}
            </a>
            <p>Clicks: {link.clicks}</p>
            <p>Conversions: {link.conversions}</p>
            <p>Commission Earned: ${(link.conversions * (link.affiliateProgram.commissionRate / 100)).toFixed(2)}</p>
          </div>
        ))}
      </div>

      // Add a new button for static export
      <button onClick={handleStaticExport}>Export as Static</button>
    </div>
  );
};

export default AffiliateLinksPage;
