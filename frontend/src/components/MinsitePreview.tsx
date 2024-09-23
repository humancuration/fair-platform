import React from 'react';
import DOMPurify from 'dompurify';

interface ComponentProps {
  type: string;
  content: string;
  style?: React.CSSProperties;
}

interface MinsitePreviewProps {
  title: string;
  content: string;
  customCSS: string;
  components: ComponentProps[];
}

const MinsitePreview: React.FC<MinsitePreviewProps> = ({ title, content, customCSS, components }) => {
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div className="minsite-preview border p-4 rounded shadow">
      <style>{customCSS}</style>
      <h2 className="text-xl font-bold mb-2">{title || 'Minsite Title'}</h2>
      <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      {components.map((component, index) => renderComponent(component, index))}
    </div>
  );
};

export default MinsitePreview;
