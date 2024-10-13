import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
  onFollowProduct?: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onFollowProduct }) => {
  return (
    <Card title={product.name} imageUrl={product.image}>
      <p>{product.description}</p>
      <p className="font-bold text-blue-500">${product.price.toFixed(2)}</p>
      {onAddToCart && (
        <Button onClick={onAddToCart} className="mt-2">Add to Cart</Button>
      )}
      {onFollowProduct && (
        <svg className="icon follow-product" viewBox="0 0 64 64" onClick={() => onFollowProduct(product.id)}>
          <circle cx="32" cy="32" r="30" stroke="#FF6F61" strokeWidth="4" fill="none" />
        </svg>
      )}
    </Card>
  );
};

export default ProductCard;