import React from 'react';

interface Tip {
  id: string;
  title: string;
  description: string;
}

const EcoTips: React.FC = () => {
  // This would typically fetch data from an API
  const tips: Tip[] = [
    { id: '1', title: 'Reduce Single-Use Plastics', description: 'Bring your own reusable bags, bottles, and containers.' },
    { id: '2', title: 'Conserve Energy', description: 'Turn off lights and unplug devices when not in use.' },
  ];

  return (
    <div className="space-y-4">
      {tips.map((tip) => (
        <div key={tip.id} className="p-4 border rounded bg-blue-50">
          <h3 className="text-lg font-semibold">{tip.title}</h3>
          <p>{tip.description}</p>
        </div>
      ))}
    </div>
  );
};

export default EcoTips;
