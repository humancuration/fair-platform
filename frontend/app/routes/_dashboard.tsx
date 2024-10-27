import { Outlet } from '@remix-run/react';
import { ErrorBoundary } from 'react-error-boundary';
import DashboardLayout from '~/components/dashboard/DashboardLayout';
import LoadingSpinner from '~/components/common/LoadingSpinner';
import ErrorFallback from '~/components/common/ErrorFallback';

export default function DashboardRoute() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </ErrorBoundary>
  );
}

export function ErrorBoundaryComponent() {
  return <ErrorFallback />;
}

export function LoaderComponent() {
  return <LoadingSpinner />;
}
