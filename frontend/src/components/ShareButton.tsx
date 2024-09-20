// frontend/src/components/ShareButton.tsx
import React from 'react';

interface ShareButtonProps {
  url: string;
  title: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ url, title }) => {
  const handleShare = () => {
    // Logic to share via ActivityPub
  };

  return (
    <button onClick={handleShare} className="bg-blue-500 text-white px-3 py-1 rounded">
      Share to Fediverse
    </button>
  );
};

export default ShareButton;
