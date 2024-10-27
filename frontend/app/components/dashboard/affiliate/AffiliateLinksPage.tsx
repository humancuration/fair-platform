import { useState } from 'react';
import type { AffiliateLink, AffiliateProgram } from '~/types/dashboard';
import AffiliateLinkCard from './AffiliateLinkCard';
import CreateAffiliateLinkModal from './CreateAffiliateLinkModal';
import DashboardCard from '../DashboardCard';

interface AffiliateLinksPageProps {
  links: AffiliateLink[];
  programs: AffiliateProgram[];
  loading?: boolean;
}

export default function AffiliateLinksPage({ links, programs, loading }: AffiliateLinksPageProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Affiliate Links</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Create New Link
        </button>
      </div>

      <DashboardCard title="Your Affiliate Links" loading={loading}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {links.map((link) => (
            <AffiliateLinkCard key={link.id} link={link} />
          ))}
        </div>
      </DashboardCard>

      {showCreateModal && (
        <CreateAffiliateLinkModal
          programs={programs}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}
