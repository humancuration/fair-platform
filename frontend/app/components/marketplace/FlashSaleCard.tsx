import type { FC } from 'react';
import { Form } from '@remix-run/react';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaBolt } from 'react-icons/fa';
import { FlashSaleCountdown } from './FlashSaleCountdown';
import { formatCurrency } from '~/utils/formatters';

interface FlashSaleProduct {
  productId: string;
  product: {
    name: string;
    image: string;
  };
  originalPrice: number;
  salePrice: number;
  quantity: number;
  soldCount: number;
}

interface FlashSale {
  id: string;
  name: string;
  description: string;
  endTime: string;
  products: FlashSaleProduct[];
}

interface FlashSaleCardProps {
  sale: FlashSale;
}

export const FlashSaleCard: FC<FlashSaleCardProps> = ({ sale }) => {
  const calculateProgress = (product: FlashSaleProduct) => {
    return (product.soldCount / product.quantity) * 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-xl overflow-hidden"
    >
      <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaBolt className="text-yellow-300 text-xl animate-pulse" />
            <h3 className="text-xl font-bold">{sale.name}</h3>
          </div>
          <FlashSaleCountdown endTime={sale.endTime} size="sm" />
        </div>
      </div>

      <div className="p-4">
        <p className="text-gray-600 mb-4">{sale.description}</p>
        
        <div className="space-y-4">
          {sale.products.map((product) => (
            <motion.div
              key={product.productId}
              className="border rounded-lg p-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-4">
                <img
                  src={product.product.image}
                  alt={product.product.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{product.product.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-red-500 font-bold">
                      {formatCurrency(product.salePrice)}
                    </span>
                    <span className="text-gray-400 line-through text-sm">
                      {formatCurrency(product.originalPrice)}
                    </span>
                    <span className="bg-red-100 text-red-500 text-xs px-2 py-1 rounded">
                      {Math.round((1 - product.salePrice / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                </div>
                <Form method="post">
                  <input type="hidden" name="intent" value="addToCart" />
                  <input type="hidden" name="productId" value={product.productId} />
                  <input type="hidden" name="saleId" value={sale.id} />
                  <button
                    type="submit"
                    disabled={product.soldCount >= product.quantity}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                      product.soldCount >= product.quantity
                        ? 'bg-gray-200 text-gray-500'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    <FaShoppingCart />
                    {product.soldCount >= product.quantity ? 'Sold Out' : 'Add to Cart'}
                  </button>
                </Form>
              </div>

              <div className="mt-3">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Sold: {product.soldCount}</span>
                  <span>Available: {product.quantity - product.soldCount}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-red-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${calculateProgress(product)}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
