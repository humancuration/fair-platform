import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMagic, FaTrash, FaCopy } from 'react-icons/fa';

const ElementContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  margin: 10px 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
`;

const MagicalInput = styled.input`
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #9d50bb;
    box-shadow: 0 0 15px rgba(157, 80, 187, 0.3);
  }
`;

const ActionButton = styled(motion.button)`
  background: rgba(157, 80, 187, 0.2);
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  color: white;
  cursor: pointer;
  margin: 0 5px;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background: rgba(157, 80, 187, 0.4);
  }
`;

interface InteractiveSurveyElementProps {
  element: any;
  onUpdate: (updatedElement: any) => void;
  onDelete?: (elementId: string) => void;
  onDuplicate?: (element: any) => void;
}

const InteractiveSurveyElement: React.FC<InteractiveSurveyElementProps> = ({
  element,
  onUpdate,
  onDelete,
  onDuplicate
}) => {
  const [localElement, setLocalElement] = useState(element);
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updatedElement = { ...localElement, [e.target.name]: e.target.value };
    setLocalElement(updatedElement);
    onUpdate(updatedElement);
  };

  const elementVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100 }
  };

  return (
    <ElementContainer
      variants={elementVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', right: '10px', top: '10px' }}
          >
            <ActionButton onClick={() => onDuplicate?.(element)}>
              <FaCopy /> Clone
            </ActionButton>
            <ActionButton onClick={() => onDelete?.(element.id)}>
              <FaTrash /> Remove
            </ActionButton>
          </motion.div>
        )}
      </AnimatePresence>

      {renderElementContent()}
    </ElementContainer>
  );

  function renderElementContent() {
    switch (element.type) {
      case 'text':
        return (
          <div>
            <MagicalInput
              type="text"
              name="label"
              value={localElement.label}
              onChange={handleChange}
              placeholder="✨ Enter your question..."
            />
          </div>
        );
      // Add more cases as needed
      default:
        return null;
    }
  }
};

export default InteractiveSurveyElement;
