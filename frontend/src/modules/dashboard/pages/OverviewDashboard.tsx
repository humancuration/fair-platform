import React from 'react';
import DashboardGrid from '../components/DashboardGrid';
import DashboardCard from '../components/DashboardCard';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { fetchDashboardStats } from '../../../api/dashboard';

const OverviewDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery('dashboardStats', fetchDashboardStats);

  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">{t('dashboard.overview')}</h1>
      <DashboardGrid columns={4}>
        <DashboardCard
          title={t('dashboard.totalRevenue')}
          loading={isLoading}
          error={error?.message}
        >
          <div className="text-2xl font-bold">${data?.totalRevenue}</div>
        </DashboardCard>
        {/* Add more cards as needed */}
      </DashboardGrid>
    </>
  );
};

export default OverviewDashboard;
