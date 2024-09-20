import React from 'react';
import DOMPurify from 'dompurify';

interface MinsitePreviewProps {
  title: string;
  content: string;
}

const MinsitePreview: React.FC<MinsitePreviewProps> = ({ title, content }) => {
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div className="minsite-preview border p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      ></div>
    </div>
  );
};

export default MinsitePreview;
