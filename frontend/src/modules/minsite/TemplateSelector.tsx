import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Template {
  id: string;
  name: string;
  preview: string;
}

const templates: Template[] = [
  { id: 'blank', name: 'Blank', preview: '/images/blank-template.png' },
  { id: 'blog', name: 'Blog', preview: '/images/blog-template.png' },
  { id: 'portfolio', name: 'Portfolio', preview: '/images/portfolio-template.png' },
  { id: 'landing', name: 'Landing Page', preview: '/images/landing-template.png' },
  { id: 'ecommerce', name: 'E-commerce', preview: '/images/ecommerce-template.png' },
];

interface TemplateSelectorProps {
  onSelect: (templateId: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect }) => {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get('/api/templates'); // Adjust API endpoint as needed
        setTemplates(response.data);
      } catch (error) {
        console.error('Error fetching templates:', error);
        alert('Failed to load templates.');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  if (loading) return <div>Loading templates...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {templates.map((template) => (
        <div
          key={template.id}
          className="cursor-pointer border rounded p-2 hover:border-blue-500"
          onClick={() => onSelect(template.id)}
        >
          <img src={template.preview} alt={template.name} className="w-full h-32 object-cover mb-2" />
          <p className="text-center">{template.name}</p>
        </div>
      ))}
    </div>
  );
};

export default TemplateSelector;