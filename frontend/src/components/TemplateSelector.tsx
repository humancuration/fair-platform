import React from 'react';

interface Template {
  id: string;
  name: string;
  description: string;
}

interface TemplateSelectorProps {
  onSelect: (template: string) => void;
  selectedTemplate: string;
}

const templates: Template[] = [
  { id: 'blank', name: 'Blank', description: 'Start with a clean slate' },
  { id: 'blog', name: 'Blog', description: 'Perfect for content creators' },
  { id: 'portfolio', name: 'Portfolio', description: 'Showcase your work' },
  { id: 'landing', name: 'Landing Page', description: 'Promote your product or service' },
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect, selectedTemplate }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Select Template</label>
      <select
        value={selectedTemplate}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full border rounded px-3 py-2"
      >
        {templates.map((template) => (
          <option key={template.id} value={template.id}>
            {template.name} - {template.description}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TemplateSelector;