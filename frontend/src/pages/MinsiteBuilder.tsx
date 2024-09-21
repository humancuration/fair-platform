import React, { useState, useEffect } from 'react';
import WYSIWYGEditor from '../components/WYSIWYGEditor';
import MinsitePreview from '../components/MinsitePreview';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import DOMPurify from 'dompurify';
import TemplateSelector from '../components/TemplateSelector';
import CSSEditor from '../components/CSSEditor';
import SEOMetadataEditor from '../components/SEOMetadataEditor';
import ComponentLibrary from '../components/ComponentLibrary';
import VersionHistory from '../components/VersionHistory';

const MinsiteBuilder: React.FC = () => {
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
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [versions, setVersions] = useState<any[]>([]);

  useEffect(() => {
    // Fetch version history
  }, []);

  const handleComponentSelect = (componentId: string) => {
    setSelectedComponents([...selectedComponents, componentId]);
    // Logic to add component to the content
  };

  const handleSave = async () => {
    try {
      const response = await axios.post('/api/minsite/save', {
        title,
        content,
        template: selectedTemplate,
        customCSS,
        seoMetadata,
        components: selectedComponents,
      }, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
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
      alert('Minsite saved successfully!');
    } catch (error) {
      console.error('Error saving minisite:', error);
      alert('Failed to save minisite.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Your Minisite</h1>
      <TemplateSelector onSelect={setSelectedTemplate} />
      <div className="flex flex-col lg:flex-row">
        {/* Editor Section */}
        <div className="w-full lg:w-2/3 lg:pr-4 mb-6 lg:mb-0">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Minsite Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your minisite title"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Content</label>
            <WYSIWYGEditor content={content} setContent={setContent} />
          </div>
          <CSSEditor css={customCSS} setCSS={setCustomCSS} /> {/* Added CSSEditor */}
          <SEOMetadataEditor metadata={seoMetadata} setMetadata={setSEOMetadata} />
          <ComponentLibrary onSelectComponent={handleComponentSelect} />
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save Minsite
          </button>
        </div>
        
        {/* Preview Section */}
        <div className="w-full lg:w-1/3">
          <h2 className="text-xl font-semibold mb-2">Live Preview</h2>
          <div className="minsite-preview border p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-2">{title || 'Minsite Title'}</h2>
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) || '<p>Start creating your minisite content...</p>' }}
            ></div>
          </div>
        </div>
      </div>
      <VersionHistory versions={versions} onRevert={(version) => {
        setContent(version.content);
        setTitle(version.title);
      }} />
      <MinsitePreview 
        title={title} 
        content={content} 
        customCSS={customCSS}
        components={selectedComponents}
      />
    </div>
  );
};

export default MinsiteBuilder;
