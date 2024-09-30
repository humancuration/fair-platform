import React from 'react';
import Card from './Card';
import Button from './Button';

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const handleAddToCart = () => {
    // Implement add to cart functionality
  };

  return (
    <Card title={product.name} imageUrl={product.image}>
      <p>{product.description}</p>
      <p className="font-bold text-blue-500">${product.price.toFixed(2)}</p>
      <Button onClick={handleAddToCart} label="Add to Cart" className="mt-2" />
    </Card>
  );
};

export default ProductCard;
