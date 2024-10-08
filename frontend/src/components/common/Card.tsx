import React from 'react';

interface CardProps {
  title: string;
  imageUrl?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, imageUrl, children, footer }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {imageUrl && (
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      )}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
          {title}
        </h2>
        <div className="text-gray-700 dark:text-gray-400">{children}</div>
      </div>
      {footer && <div className="p-4 border-t dark:border-gray-700">{footer}</div>}
    </div>
  );
};

export default Card;