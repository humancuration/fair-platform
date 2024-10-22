import React from 'react';

interface SurveyComponentMarketplaceProps {
  onAddComponent: (component: any) => void;
}

const SurveyComponentMarketplace: React.FC<SurveyComponentMarketplaceProps> = ({ onAddComponent }) => {
  const components = [
    { type: 'text', label: 'Text Input' },
    { type: 'multipleChoice', label: 'Multiple Choice' },
    // Add more component types
  ];

  return (
    <div className="survey-component-marketplace">
      <h3>Add Components</h3>
      {components.map((component, index) => (
        <button key={index} onClick={() => onAddComponent(component)}>
          {component.label}
        </button>
      ))}
    </div>
  );
};

export default SurveyComponentMarketplace;