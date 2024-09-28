// frontend/src/components/ProductCard.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/outline'; // Install heroicons

// Define Product interface
interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  // Add other relevant fields
}

const ProductCard: React.FC<{ product: Product }> = React.memo(({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleClick = () => {
    // Navigate to product detail page
    console.log(`Navigating to product detail page for ${product.name}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
    // Optionally, update backend
  };

  const handleAddToCart = () => {
    // Implement add to cart functionality
    alert(`${product.name} added to cart!`);
  };

  const handleQuickView = () => {
    // Implement quick view functionality, e.g., open a modal
    alert(`Quick view for ${product.name}`);
  };

  return (
    <motion.article
      className="product-card bg-white dark:bg-gray-800 p-4 rounded shadow hover:shadow-lg transition-shadow duration-300 relative"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      whileHover={{ scale: 1.02 }}
    >
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded" />
      <h2 className="text-lg font-semibold mt-2 text-gray-800 dark:text-gray-200">{product.name}</h2>
      <p className="text-gray-600 dark:text-gray-400">{product.description}</p>
      <p className="text-blue-500 font-bold mt-2">${product.price.toFixed(2)}</p>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 mt-4">
        <button onClick={handleQuickView} className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
          <EyeIcon className="h-5 w-5" />
        </button>
        <button onClick={handleAddToCart} className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
          <ShoppingCartIcon className="h-5 w-5" />
        </button>
        <button onClick={toggleFavorite} className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
          <HeartIcon className={`h-5 w-5 ${isFavorite ? 'text-red-500' : ''}`} />
        </button>
      </div>
    </motion.article>
  );
});

export default ProductCard;
