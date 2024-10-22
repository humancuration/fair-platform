import React from 'react';

interface Product {
  id: number;
  name: string;
  image: string;
  type?: 'background' | 'outfit' | 'accessory';
}

interface AvatarItemPreviewProps {
  product: Product;
}

const AvatarItemPreview: React.FC<AvatarItemPreviewProps> = ({ product }) => {
  return (
    <div className="relative w-32 h-32 mx-auto">
      <img
        src="/images/avatar-placeholder.png"
        alt="Avatar placeholder"
        className="w-full h-full object-cover"
      />
      {product.type === 'background' && (
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}
      {product.type === 'outfit' && (
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain z-10"
        />
      )}
      {product.type === 'accessory' && (
        <img
          src={product.image}
          alt={product.name}
          className="absolute top-0 left-0 w-1/2 h-1/2 object-contain z-20"
        />
      )}
    </div>
  );
};

export default AvatarItemPreview;
