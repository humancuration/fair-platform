import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../../components/common/ErrorFallback';

const Dashboard: React.FC = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <DashboardLayout>
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    </ErrorBoundary>
  );
};

export default Dashboard;
