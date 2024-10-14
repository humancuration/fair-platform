import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface Component {
  id: string;
  name: string;
  icon: string;
}

const components: Component[] = [
  { id: 'header', name: 'Header', icon: '🏷️' },
  { id: 'paragraph', name: 'Paragraph', icon: '📝' },
  { id: 'image', name: 'Image', icon: '🖼️' },
  { id: 'button', name: 'Button', icon: '🔘' },
  { id: 'divider', name: 'Divider', icon: '➖' },
  { id: 'social-icons', name: 'Social Icons', icon: '🔗' },
  { id: 'contact-form', name: 'Contact Form', icon: '📨' },
  { id: 'gallery', name: 'Gallery', icon: '🖼️' },
];

interface ComponentLibraryProps {
  onSelectComponent: (componentId: string) => void;
}

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onSelectComponent }) => {
  return (
    <LibraryContainer>
      {components.map((component) => (
        <ComponentItem
          key={component.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectComponent(component.id)}
        >
          <IconWrapper>{component.icon}</IconWrapper>
          <ComponentName>{component.name}</ComponentName>
        </ComponentItem>
      ))}
    </LibraryContainer>
  );
};

const LibraryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  padding: 1rem;
`;

const ComponentItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.background};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
  }
`;

const IconWrapper = styled.span`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const ComponentName = styled.p`
  font-size: 0.9rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
`;

export default ComponentLibrary;
