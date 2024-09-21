import React from 'react';
import DOMPurify from 'dompurify';

interface MinsitePreviewProps {
  title: string;
  content: string;
  customCSS: string;
  components: string[];
}

const MinsitePreview: React.FC<MinsitePreviewProps> = ({ title, content, customCSS, components }) => {
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div className="minsite-preview border p-4 rounded shadow">
      <style>{customCSS}</style>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
      {components.map((component, index) => (
        <div key={index} className="component">
          {/* Render component based on type */}
          {component === 'header' && <h1>Header Component</h1>}
          {component === 'paragraph' && <p>Paragraph Component</p>}
          {/* Add more component types as needed */}
        </div>
      ))}
    </div>
  );
};

export default MinsitePreview;
