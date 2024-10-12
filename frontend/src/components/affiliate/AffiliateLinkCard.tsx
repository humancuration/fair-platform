// frontend/src/components/AffiliateLinkCard.tsx

import React from 'react';
import { LinkIcon, AnalyticsIcon, EditIcon, DeleteIcon } from '@heroicons/react/outline';
import api from '@api/api';

interface AffiliateLink {
  id: number;
  originalLink: string;
  generatedLink: string;
  customAlias: string;
  affiliateProgram: {
    name: string;
    commissionRate: number;
  };
}

interface Props {
  link: AffiliateLink;
}

const AffiliateLinkCard: React.FC<Props> = ({ link }) => {
  const handleDelete = async () => {
    try {
      await api.delete(`/affiliate-links/${link.id}`);
      // Refresh or update state
    } catch (error) {
      console.error('Error deleting affiliate link', error);
    }
  };

  return (
    <div className="border rounded p-4 shadow">
      <h2 className="text-xl font-semibold mb-2">{link.affiliateProgram.name}</h2>
      <p className="text-sm text-gray-600 mb-2">Commission: {link.affiliateProgram.commissionRate}%</p>
      <p className="text-sm mb-2">
        <strong>Original Link:</strong> <a href={link.originalLink} className="text-blue-500" target="_blank" rel="noopener noreferrer">{link.originalLink}</a>
      </p>
      <p className="text-sm mb-4">
        <strong>Generated Link:</strong> <a href={link.generatedLink} className="text-blue-500" target="_blank" rel="noopener noreferrer">{link.generatedLink}</a>
      </p>
      <div className="flex space-x-2">
        <button className="text-green-500 flex items-center">
          <LinkIcon className="h-5 w-5 mr-1" />
          View
        </button>
        <button className="text-blue-500 flex items-center">
          <AnalyticsIcon className="h-5 w-5 mr-1" />
          Analytics
        </button>
        <button className="text-yellow-500 flex items-center">
          <EditIcon className="h-5 w-5 mr-1" />
          Edit
        </button>
        <button className="text-red-500 flex items-center" onClick={handleDelete}>
          <DeleteIcon className="h-5 w-5 mr-1" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default AffiliateLinkCard;
