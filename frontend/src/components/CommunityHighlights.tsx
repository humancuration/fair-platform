import React from 'react';

interface Highlight {
  id: string;
  title: string;
  description: string;
}

const CommunityHighlights: React.FC = () => {
  // This would typically fetch data from an API
  const highlights: Highlight[] = [
    { id: '1', title: 'Community Clean-up Day', description: 'Over 1000 volunteers participated!' },
    { id: '2', title: 'Eco-friendly Product of the Month', description: 'Bamboo toothbrushes are making waves!' },
  ];

  return (
    <div className="space-y-4">
      {highlights.map((highlight) => (
        <div key={highlight.id} className="p-4 border rounded bg-green-50">
          <h3 className="text-lg font-semibold">{highlight.title}</h3>
          <p>{highlight.description}</p>
        </div>
      ))}
    </div>
  );
};

export default CommunityHighlights;
