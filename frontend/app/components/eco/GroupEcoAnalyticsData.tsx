import React from 'react';
import { useLoaderData } from '@remix-run/react';
import { Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import type { GroupEcoData } from '~/types/eco';

const GroupEcoAnalyticsData: React.FC = () => {
  const { groupEcoData } = useLoaderData<{ groupEcoData: GroupEcoData[] }>();

  const chartData = {
    labels: groupEcoData.map(g => g.name),
    datasets: [
      {
        label: 'Carbon Offset (kg)',
        data: groupEcoData.map(g => g.carbonOffset),
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
      {
        label: 'Resources Shared',
        data: groupEcoData.map(g => g.resourcesShared),
        backgroundColor: 'rgba(153,102,255,0.6)',
      }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Bar 
        data={chartData}
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              position: 'bottom'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.dataset.label || '';
                  const value = context.parsed.y;
                  return `${label}: ${value}`;
                }
              }
            }
          }
        }}
      />
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        {groupEcoData.map((group) => (
          <motion.div
            key={group.id}
            whileHover={{ scale: 1.02 }}
            className="p-3 rounded-lg bg-gray-50"
          >
            <h4 className="font-semibold">{group.name}</h4>
            <div className="text-sm text-gray-600 mt-1">
              <p>Members: {group.memberCount}</p>
              <p>Projects: {group.projectCount}</p>
              <p>Impact Score: {group.impactScore}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default GroupEcoAnalyticsData; 