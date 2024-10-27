import type { FC } from 'react';
import { Link, Form } from '@remix-run/react';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { formatCurrency } from '~/utils/formatters';
import type { Product } from '~/types/marketplace';

interface ProductCardProps {
  product: Product;
  isInWishlist?: boolean;
}

export const ProductCard: FC<ProductCardProps> = ({ 
  product,
  isInWishlist = false,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <Link to={`/marketplace/${product.id}`} prefetch="intent">
        <div className="relative h-48">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
              -{product.discount}%
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>

          <div className="flex justify-between items-center">
            <div>
              {product.discount > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-red-500">
                    {formatCurrency(product.price * (1 - product.discount / 100))}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {formatCurrency(product.price)}
                  </span>
                </div>
              ) : (
                <span className="text-xl font-bold">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>

            {product.stock <= 5 && product.stock > 0 && (
              <span className="text-sm text-orange-500">
                Only {product.stock} left!
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="p-4 border-t flex justify-between">
        <Form method="post">
          <input type="hidden" name="intent" value="toggleWishlist" />
          <input type="hidden" name="productId" value={product.id} />
          <button
            type="submit"
            className="text-gray-500 hover:text-red-500 transition"
          >
            {isInWishlist ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          </button>
        </Form>

        <Form method="post">
          <input type="hidden" name="intent" value="addToCart" />
          <input type="hidden" name="productId" value={product.id} />
          <button
            type="submit"
            disabled={product.stock === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 transition"
          >
            <FaShoppingCart />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </Form>
      </div>
    </div>
  );
};
