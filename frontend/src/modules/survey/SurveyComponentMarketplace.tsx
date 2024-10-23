import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaFont, FaList, FaCheckSquare, FaImage, FaStar, FaSliders } from 'react-icons/fa';

const MarketplaceContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  margin: 20px 0;
`;

const ComponentCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const IconWrapper = styled.div`
  font-size: 24px;
  margin-bottom: 10px;
  color: #9d50bb;
`;

const ComponentTitle = styled.h4`
  margin: 0;
  font-size: 14px;
  color: white;
`;

const components = [
  { type: 'text', label: 'Text Input', icon: FaFont },
  { type: 'multipleChoice', label: 'Multiple Choice', icon: FaList },
  { type: 'checkbox', label: 'Checkboxes', icon: FaCheckSquare },
  { type: 'imageUpload', label: 'Image Upload', icon: FaImage },
  { type: 'rating', label: 'Rating Scale', icon: FaStar },
  { type: 'slider', label: 'Slider', icon: FaSliders },
];

interface SurveyComponentMarketplaceProps {
  onAddComponent: (component: any) => void;
}

const SurveyComponentMarketplace: React.FC<SurveyComponentMarketplaceProps> = ({ onAddComponent }) => {
  return (
    <MarketplaceContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {components.map((component, index) => (
        <ComponentCard
          key={index}
          onClick={() => onAddComponent(component)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <IconWrapper>
            <component.icon />
          </IconWrapper>
          <ComponentTitle>{component.label}</ComponentTitle>
        </ComponentCard>
      ))}
    </MarketplaceContainer>
  );
};

export default SurveyComponentMarketplace;
