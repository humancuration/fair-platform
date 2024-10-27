import React from 'react';
import { Link } from '@remix-run/react';
import { LinkIcon, BarChart2, Edit, Trash } from 'react-feather';
import type { AffiliateLink } from '~/types/dashboard';

interface AffiliateLinkCardProps {
  link: AffiliateLink;
  onDelete?: (id: string) => void;
}

export default function AffiliateLinkCard({ link, onDelete }: AffiliateLinkCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {link.customAlias || link.affiliateProgram.name}
        </h3>
        <div className="flex space-x-2">
          <Link
            to={`/dashboard/affiliate/analytics/${link.id}`}
            className="text-blue-500 hover:text-blue-600"
          >
            <BarChart2 className="h-5 w-5" />
          </Link>
          <Link
            to={`/dashboard/affiliate/edit/${link.id}`}
            className="text-yellow-500 hover:text-yellow-600"
          >
            <Edit className="h-5 w-5" />
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(link.id)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <LinkIcon className="h-4 w-4 mr-2" />
          <a 
            href={link.generatedLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 truncate"
          >
            {link.generatedLink}
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <div className="text-gray-500 dark:text-gray-400">Clicks</div>
            <div className="text-lg font-semibold">{link.clicks}</div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400">Conversions</div>
            <div className="text-lg font-semibold">{link.conversions}</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-gray-500 dark:text-gray-400">Commission Rate</div>
          <div className="text-lg font-semibold text-green-500">
            {link.affiliateProgram.commissionRate}%
          </div>
        </div>
      </div>
    </div>
  );
}
