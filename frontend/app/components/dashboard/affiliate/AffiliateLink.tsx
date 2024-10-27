import React from 'react';
import { Link } from '@remix-run/react';
import { ExternalLink, BarChart2 } from 'react-feather';
import type { AffiliateLink as AffiliateLinkType } from '~/types/dashboard';

interface AffiliateLinkProps {
  link: AffiliateLinkType;
  showStats?: boolean;
}

export default function AffiliateLink({ link, showStats = true }: AffiliateLinkProps) {
  return (
    <div className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">
            {link.customAlias || link.affiliateProgram.name}
          </h3>
          <a
            href={link.originalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 flex items-center mt-1"
          >
            Original Link <ExternalLink className="h-4 w-4 ml-1" />
          </a>
        </div>
        {showStats && (
          <Link
            to={`/dashboard/affiliate/analytics/${link.id}`}
            className="text-blue-500 hover:text-blue-600"
          >
            <BarChart2 className="h-5 w-5" />
          </Link>
        )}
      </div>

      {showStats && (
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500 dark:text-gray-400">Clicks</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {link.clicks.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400">Conversions</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {link.conversions.toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
