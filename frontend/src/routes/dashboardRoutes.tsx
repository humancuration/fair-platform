import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const MarketplaceAnalyticsDashboard = lazy(() => import('../modules/dashboard/MarketplaceAnalyticsDashboard'));

export const dashboardRoutes: RouteObject[] = [
  // ... existing routes ...
  {
    path: 'marketplace-analytics',
    element: <MarketplaceAnalyticsDashboard />,
  },
  // ... other routes ...
];
