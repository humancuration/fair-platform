// frontend/src/components/CreateAffiliateLinkModal.tsx

import React, { useEffect, useState } from 'react';
import api from '@api/api';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const CreateAffiliateLinkModal: React.FC<Props> = ({ onClose, onCreated }) => {
  const [affiliatePrograms, setAffiliatePrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [originalLink, setOriginalLink] = useState('');
  const [customAlias, setCustomAlias] = useState('');

  const fetchAffiliatePrograms = async () => {
    try {
      const response = await api.get('/affiliate-programs');
      setAffiliatePrograms(response.data);
      if (response.data.length > 0) {
        setSelectedProgram(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching affiliate programs', error);
    }
  };

  useEffect(() => {
    fetchAffiliatePrograms();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/affiliate-links', {
        affiliateProgramId: selectedProgram,
        originalLink,
        customAlias,
      });
      onCreated();
      onClose();
    } catch (error) {
      console.error('Error creating affiliate link', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create Affiliate Link</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Affiliate Program</label>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            >
              {affiliatePrograms.map((program: any) => (
                <option key={program.id} value={program.id}>
                  {program.name} ({program.commissionRate}%)
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
            <label className="block text-sm font-medium mb-1">Custom Alias (optional)</label>
            <input
              type="text"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g., my-product"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAffiliateLinkModal;
