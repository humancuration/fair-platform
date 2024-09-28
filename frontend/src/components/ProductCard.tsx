import React from 'react';

// Define Product interface
interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  // Add other relevant fields
}

const ProductCard: React.FC<{ product: Product }> = React.memo(({ product }) => { // Wrapped with React.memo
  const handleClick = () => { // Added handleClick function
    // Navigate to product detail page
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { // Added handleKeyDown function
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  return (
    <article className="product-card" role="button" tabIndex={0} onClick={handleClick} onKeyDown={handleKeyDown}>
      <img src={product.image} alt={product.name} />
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-gray-600">{product.description}</p>
    </article>
  );
});

export default ProductCard;
