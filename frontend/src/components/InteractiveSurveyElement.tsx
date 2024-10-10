import React, { useState } from 'react';

interface InteractiveSurveyElementProps {
  element: any;
  onUpdate: (updatedElement: any) => void;
}

const InteractiveSurveyElement: React.FC<InteractiveSurveyElementProps> = ({ element, onUpdate }) => {
  const [localElement, setLocalElement] = useState(element);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updatedElement = { ...localElement, [e.target.name]: e.target.value };
    setLocalElement(updatedElement);
    onUpdate(updatedElement);
  };

  switch (element.type) {
    case 'text':
      return (
        <div>
          <label>{localElement.label}</label>
          <input
            type="text"
            name="label"
            value={localElement.label}
            onChange={handleChange}
            placeholder="Enter question"
          />
        </div>
      );
    case 'multipleChoice':
      return (
        <div>
          <label>{localElement.label}</label>
          <input
            type="text"
            name="label"
            value={localElement.label}
            onChange={handleChange}
            placeholder="Enter question"
          />
          {/* Add options management here */}
        </div>
      );
    // Add more cases for different element types
    default:
      return null;
  }
};

export default InteractiveSurveyElement;