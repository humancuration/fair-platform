import React from 'react';
import { motion } from 'framer-motion';
import DashboardHeader from './components/DashboardHeader';
import DashboardSidebar from './components/DashboardSidebar';
import DashboardGrid from './components/DashboardGrid';
import AnalyticsCard from '../analytics/AnalyticsCard';
import GroupsOverviewSection from '../components/GroupsOverviewSection';
import ResourceMetricsCard from '../components/ResourceMetricsCard';
import ContributionTimeline from '../components/ContributionTimeline';
import { useTranslation } from 'react-i18next';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      
      <div className="flex">
        <DashboardSidebar />
        
        <main className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('dashboard.welcome')}
            </h1>

            <DashboardGrid columns={4}>
              <ResourceMetricsCard 
                title={t('dashboard.computeCredits')}
                value={1250}
                change={12.5}
                type="compute"
              />
              <ResourceMetricsCard 
                title={t('dashboard.learningPoints')}
                value={850}
                change={5.2}
                type="learning"
              />
              <ResourceMetricsCard 
                title={t('dashboard.contributionScore')}
                value={92}
                change={3.1}
                type="contribution"
              />
              <ResourceMetricsCard 
                title={t('dashboard.communityImpact')}
                value={456}
                change={8.7}
                type="impact"
              />
            </DashboardGrid>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnalyticsCard />
              <ContributionTimeline />
            </div>

            <GroupsOverviewSection />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
