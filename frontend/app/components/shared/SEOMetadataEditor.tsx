import React from 'react';

interface SEOMetadata {
  title: string;
  description: string;
  keywords: string;
}

interface SEOMetadataEditorProps {
  metadata: SEOMetadata;
  setMetadata: (metadata: SEOMetadata) => void;
}

const SEOMetadataEditor: React.FC<SEOMetadataEditorProps> = ({ metadata, setMetadata }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMetadata({ ...metadata, [name]: value });
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">SEO Metadata</h3>
      <div className="space-y-2">
        <div>
          <label htmlFor="seo-title" className="block text-sm font-medium mb-1">Title</label>
          <input
            id="seo-title"
            type="text"
            name="title"
            value={metadata.title}
            onChange={handleChange}
            placeholder="SEO Title"
            className="w-full border rounded px-3 py-2"
            maxLength={60}
          />
          <p className="text-sm text-gray-500 mt-1">{metadata.title.length}/60 characters</p>
        </div>
        <div>
          <label htmlFor="seo-description" className="block text-sm font-medium mb-1">Description</label>
          <textarea
            id="seo-description"
            name="description"
            value={metadata.description}
            onChange={handleChange}
            placeholder="SEO Description"
            className="w-full border rounded px-3 py-2 h-20"
            maxLength={160}
          />
          <p className="text-sm text-gray-500 mt-1">{metadata.description.length}/160 characters</p>
        </div>
        <div>
          <label htmlFor="seo-keywords" className="block text-sm font-medium mb-1">Keywords</label>
          <input
            id="seo-keywords"
            type="text"
            name="keywords"
            value={metadata.keywords}
            onChange={handleChange}
            placeholder="SEO Keywords (comma-separated)"
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
};

export default SEOMetadataEditor;