import React from 'react';
import { useLoaderData } from '@remix-run/react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { FaLeaf, FaSeedling, FaRecycle } from 'react-icons/fa';
import GroupEcoAnalyticsData from './GroupEcoAnalyticsData';
import type { EcoAnalyticsData } from '~/types/eco';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string | string[];
    fill?: boolean;
  }[];
}

const EcoAnalytics: React.FC = () => {
  const { ecoData } = useLoaderData<{ ecoData: EcoAnalyticsData }>();

  const lineChartData: ChartData = {
    labels: ecoData.timeline.map((d) => d.date),
    datasets: [
      {
        label: 'Community Savings ($)',
        data: ecoData.timeline.map((d) => d.communitySavings),
        borderColor: 'rgba(75,192,192,1)',
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
      },
      {
        label: 'Carbon Offset (kg)',
        data: ecoData.timeline.map((d) => d.carbonOffset),
        borderColor: 'rgba(153,102,255,1)',
        fill: true,
        backgroundColor: 'rgba(153,102,255,0.2)',
      },
    ],
  };

  const impactData: ChartData = {
    labels: ['Education', 'Infrastructure', 'Research', 'Community Projects'],
    datasets: [{
      label: 'Resource Distribution',
      data: [
        ecoData.impact.education,
        ecoData.impact.infrastructure,
        ecoData.impact.research,
        ecoData.impact.communityProjects
      ],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
      ],
    }],
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Collective Environmental Impact</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-green-50 p-4 rounded-lg"
          >
            <FaLeaf className="text-green-500 text-3xl mb-2" />
            <h3 className="font-semibold">Total Carbon Offset</h3>
            <p className="text-2xl text-green-600">{ecoData.totalCarbonOffset}kg</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-blue-50 p-4 rounded-lg"
          >
            <FaSeedling className="text-blue-500 text-3xl mb-2" />
            <h3 className="font-semibold">Community Savings</h3>
            <p className="text-2xl text-blue-600">${ecoData.totalSavings}</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-purple-50 p-4 rounded-lg"
          >
            <FaRecycle className="text-purple-500 text-3xl mb-2" />
            <h3 className="font-semibold">Resources Shared</h3>
            <p className="text-2xl text-purple-600">{ecoData.resourcesShared}</p>
          </motion.div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Progress Over Time</h3>
          <Line data={lineChartData} options={{ responsive: true }} />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Resource Distribution</h3>
            <Doughnut data={impactData} options={{ responsive: true }} />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Group Contributions</h3>
            <GroupEcoAnalyticsData />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EcoAnalytics;