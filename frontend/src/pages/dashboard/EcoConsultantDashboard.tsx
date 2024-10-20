import React, { Suspense, lazy } from 'react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EcoAnalytics = lazy(() => import('../../modulesf/eco/EcoAnalytics'));
const GroupEcoAnalytics = lazy(() => import('../components/GroupEcoAnalytics'));

const EcoConsultantDashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Eco Consultant Dashboard</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <EcoAnalytics />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <GroupEcoAnalytics />
      </Suspense>
    </div>
  );
};

export default EcoConsultantDashboard;