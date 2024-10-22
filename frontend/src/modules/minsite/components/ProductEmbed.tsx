import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../../types/Product';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../store/slices/cartSlice';
import { FaShoppingCart } from 'react-icons/fa';

interface ProductEmbedProps {
  product: Product;
  layout?: 'grid' | 'list' | 'featured';
  showDescription?: boolean;
}

const ProductEmbed: React.FC<ProductEmbedProps> = ({ 
  product, 
  layout = 'grid',
  showDescription = true 
}) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  return (
    <motion.div
      className={`product-embed ${layout} bg-white rounded-lg shadow-md overflow-hidden`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.discount > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
            -{product.discount}%
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        {showDescription && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {product.discount > 0 ? (
              <>
                <span className="text-xl font-bold text-red-500">
                  ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaShoppingCart />
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductEmbed;
