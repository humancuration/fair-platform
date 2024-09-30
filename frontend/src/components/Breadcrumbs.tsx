// frontend/src/components/Breadcrumbs.tsx

import React from 'react';
import { withBreadcrumbs, BreadcrumbsRoute } from 'react-router-breadcrumbs-hoc';
import { Link } from 'react-router-dom';

const routes: BreadcrumbsRoute[] = [
  { path: '/', breadcrumb: 'Home' },
  { path: '/login', breadcrumb: 'Login' },
  { path: '/signup', breadcrumb: 'Signup' },
  { path: '/dashboard', breadcrumb: 'Dashboard' },
  { path: '/dashboard/affiliate-links', breadcrumb: 'Affiliate Links' },
  { path: '/dashboard/affiliate-analytics', breadcrumb: 'Affiliate Analytics' },
  { path: '/dashboard/profile', breadcrumb: 'Profile' },
  { path: '/dashboard/settings', breadcrumb: 'Settings' },
  { path: '/dashboard/activity-log', breadcrumb: 'Activity Log' },
  { path: '/dashboard/notifications', breadcrumb: 'Notifications' },
  // Add more routes as needed
];

const Breadcrumbs: React.FC<any> = ({ breadcrumbs }) => (
  <nav className="text-sm mb-4">
    {breadcrumbs.map(({ match, breadcrumb }, index) => (
      <span key={match.pathname}>
        <Link to={match.pathname} className="text-blue-500 hover:underline">
          {breadcrumb}
        </Link>
        {index < breadcrumbs.length - 1 && ' / '}
      </span>
    ))}
  </nav>
);

export default withBreadcrumbs(routes)(Breadcrumbs);
