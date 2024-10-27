import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Template } from "~/types/models";

interface TemplateSelectorProps {
  selected: string;
  onSelect: (templateId: string) => void;
  templates?: Template[];
}

const defaultTemplates = [
  { id: 'blank', name: 'Blank', preview: '/images/templates/blank.png' },
  { id: 'blog', name: 'Blog', preview: '/images/templates/blog.png' },
  { id: 'portfolio', name: 'Portfolio', preview: '/images/templates/portfolio.png' },
  { id: 'landing', name: 'Landing Page', preview: '/images/templates/landing.png' },
  { id: 'ecommerce', name: 'E-commerce', preview: '/images/templates/ecommerce.png' },
];

export function TemplateSelector({ selected, onSelect, templates = [] }: TemplateSelectorProps) {
  const allTemplates = [
    ...defaultTemplates,
    ...templates.map(t => ({
      id: t.id,
      name: t.name,
      preview: t.preview
    }))
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 my-4">
      {allTemplates.map((template) => (
        <motion.div
          key={template.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
            selected === template.id ? 'border-blue-500' : 'border-gray-200'
          }`}
          onClick={() => onSelect(template.id)}
        >
          <img
            src={template.preview}
            alt={template.name}
            className="w-full h-32 object-cover"
          />
          <div className="p-2 text-center">{template.name}</div>
        </motion.div>
      ))}
    </div>
  );
}
