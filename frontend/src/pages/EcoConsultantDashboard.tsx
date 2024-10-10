import React from 'react';
import EcoAnalytics from '../components/EcoAnalytics'; // Import EcoAnalytics component
import GroupEcoAnalytics from '../components/GroupEcoAnalytics'; // Import GroupEcoAnalytics component

const EcoConsultantDashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Eco Consultant Dashboard</h1>
      <EcoAnalytics />
      
      {{ /* Add Group Analytics Section */ }}
      <GroupEcoAnalytics />
    </div>
  );
};

export default EcoConsultantDashboard;