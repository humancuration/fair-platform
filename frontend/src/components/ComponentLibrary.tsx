import React from 'react';

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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {components.map((component) => (
        <div
          key={component.id}
          className="cursor-pointer border rounded p-2 hover:border-blue-500 text-center"
          onClick={() => onSelectComponent(component.id)}
        >
          <span className="text-2xl mb-2">{component.icon}</span>
          <p>{component.name}</p>
        </div>
      ))}
    </div>
  );
};

export default ComponentLibrary;