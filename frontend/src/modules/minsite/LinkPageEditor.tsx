// components/LinkPageEditor.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button } from '@mui/material';
import TemplateSelector from './TemplateSelector';
import LinkedContentManager from '../../components/LinkedContentManager';

interface LinkForm {
  url: string;
  title: string;
}

const LinkPageEditor: React.FC = () => {
  const [links, setLinks] = useState<LinkForm[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('blank');
  const { control, handleSubmit, reset } = useForm<LinkForm>();

  const handleAddLink = (data: LinkForm) => {
    setLinks([...links, data]);
    reset();
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`link-page-editor template-${selectedTemplate} p-4`}
    >
      <h1 className="text-2xl font-bold mb-4">Link Page Editor</h1>
      
      <TemplateSelector onSelect={handleTemplateChange} />

      <form onSubmit={handleSubmit(handleAddLink)} className="mb-4">
        <Controller
          name="url"
          control={control}
          defaultValue=""
          rules={{ required: 'URL is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="URL"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
        <Controller
          name="title"
          control={control}
          defaultValue=""
          rules={{ required: 'Title is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Title"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
        <Button type="submit" variant="contained" color="primary">
          Add Link
        </Button>
      </form>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Added Links</h2>
        <ul>
          {links.map((link, index) => (
            <li key={index} className="mb-2">
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {link.title}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <LinkedContentManager surveyId="link-page" />
    </motion.div>
  );
};

export default LinkPageEditor;
