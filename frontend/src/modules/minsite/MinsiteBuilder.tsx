import React, { useState, useEffect } from 'react';
import WYSIWYGEditor from './WYSIWYGEditor';
import MinsitePreview from './MinsitePreview';
import axios from 'axios';
import { useSelector, useParams } from 'react-router-dom';
import { RootState } from '../../store/store';
import DOMPurify from 'dompurify';
import TemplateSelector from './TemplateSelector';
import CSSEditor from '../../components/CSSEditor';
import SEOMetadataEditor from '../../components/SEOMetadataEditor';
import ComponentLibrary from '../../components/ComponentLibrary';
import VersionHistory from '../versionControl/VersionHistory';
import { useMutation, useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { TextField, Button, CircularProgress } from '@mui/material';

interface ComponentProps {
  type: string;
  content: string;
  style?: React.CSSProperties;
}

const MinsiteBuilder: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('blank');
  const [customCSS, setCustomCSS] = useState<string>(''); // Added customCSS state
  const userToken = useSelector((state: RootState) => state.user.token);
  const [seoMetadata, setSEOMetadata] = useState({
    title: '',
    description: '',
    keywords: '',
  });
  const [selectedComponents, setSelectedComponents] = useState<ComponentProps[]>([]);
  const [versions, setVersions] = useState<any[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState('');

  const { data: minsiteData, isLoading: isFetchingMinsite } = useQuery(
    ['minsite', id],
    () => axios.get(`/api/minsite/${id}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    }).then(res => res.data),
    {
      enabled: !!id,
      onSuccess: (data) => {
        setTitle(data.title);
        setContent(data.content);
        setSelectedTemplate(data.template);
        setCustomCSS(data.customCSS);
        setSEOMetadata(data.seoMetadata);
        setSelectedComponents(data.components);
        setVersions(data.versions);
      },
    }
  );

  const saveMutation = useMutation(
    (minsiteData: any) => axios[id ? 'put' : 'post'](
      id ? `/api/minsite/${id}` : '/api/minsite/save',
      minsiteData,
      { headers: { Authorization: `Bearer ${userToken}` } }
    ),
    {
      onSuccess: () => {
        alert('Minsite saved successfully!');
        const newVersion = { 
          id: Date.now(), 
          content, 
          title, 
          timestamp: new Date().toISOString(),
          template: selectedTemplate,
          customCSS,
          seoMetadata,
          components: selectedComponents,
        };
        setVersions([newVersion, ...versions]);
      },
      onError: () => alert('Failed to save minsite.'),
    }
  );

  const publishMutation = useMutation(
    () => axios.post(`/api/minsite/${id}/publish`, {}, {
      headers: { Authorization: `Bearer ${userToken}` },
    }),
    {
      onSuccess: (response) => {
        setIsPublished(true);
        setPublishedUrl(response.data.publishedUrl);
        alert('Minsite published successfully!');
      },
      onError: () => alert('Failed to publish minsite.'),
    }
  );

  const handleComponentSelect = (componentId: string) => {
    // Update this to create a ComponentProps object
    const newComponent: ComponentProps = {
      type: componentId,
      content: '',
    };
    setSelectedComponents([...selectedComponents, newComponent]);
  };

  const handleInsertComponent = (index: number) => {
    // Logic to insert component at the specified index
    console.log('Inserting component at index:', index);
  };

  const handleSave = () => {
    saveMutation.mutate({
      title,
      content,
      template: selectedTemplate,
      customCSS,
      seoMetadata,
      components: selectedComponents,
    });
  };

  const handlePublish = () => {
    publishMutation.mutate();
  };

  if (isFetchingMinsite) return <CircularProgress />;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4"
    >
      <h1 className="text-2xl font-bold mb-4">Create Your Minisite</h1>
      <TemplateSelector onSelect={setSelectedTemplate} />
      <div className="flex flex-col lg:flex-row">
        {/* Editor Section */}
        <div className="w-full lg:w-2/3 lg:pr-4 mb-6 lg:mb-0">
          <TextField
            label="Minsite Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <WYSIWYGEditor 
            content={content} 
            setContent={setContent} 
            onInsertComponent={handleInsertComponent}
          />
          <CSSEditor css={customCSS} setCSS={setCustomCSS} />
          <SEOMetadataEditor metadata={seoMetadata} setMetadata={setSEOMetadata} />
          <ComponentLibrary onSelectComponent={handleComponentSelect} />
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={saveMutation.isLoading}
          >
            {saveMutation.isLoading ? <CircularProgress size={24} /> : 'Save Minsite'}
          </Button>
        </div>
        
        {/* Preview Section */}
        <div className="w-full lg:w-1/3">
          <h2 className="text-xl font-semibold mb-2">Live Preview</h2>
          <MinsitePreview 
            title={title} 
            content={content} 
            customCSS={customCSS}
            components={selectedComponents}
          />
        </div>
      </div>
      <VersionHistory versions={versions} onRevert={(version) => {
        setContent(version.content);
        setTitle(version.title);
      }} />
      <div className="mt-4">
        <Button
          onClick={handlePublish}
          variant="contained"
          color="secondary"
          disabled={isPublished || publishMutation.isLoading}
        >
          {publishMutation.isLoading ? <CircularProgress size={24} /> : (isPublished ? 'Published' : 'Publish Minsite')}
        </Button>
        {isPublished && (
          <a
            href={publishedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-blue-500 hover:underline"
          >
            View Published Minsite
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default MinsiteBuilder;
