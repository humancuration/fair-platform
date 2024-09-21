import React from 'react';

interface Component {
  id: string;
  name: string;
  icon: string;
}

interface ComponentLibraryProps {
  onSelectComponent: (componentId: string) => void;
}

const components: Component[] = [
  { id: 'header', name: 'Header', icon: '🏷️' },
  { id: 'paragraph', name: 'Paragraph', icon: '📝' },
  { id: 'image', name: 'Image', icon: '🖼️' },
  { id: 'button', name: 'Button', icon: '🔘' },
  { id: 'form', name: 'Form', icon: '📋' },
];

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onSelectComponent }) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Component Library</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {components.map((component) => (
          <button
            key={component.id}
            onClick={() => onSelectComponent(component.id)}
            className="flex flex-col items-center justify-center border rounded px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
          >
            <span className="text-2xl mb-1">{component.icon}</span>
            {component.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ComponentLibrary;