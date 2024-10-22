import React from 'react';
import { motion } from 'framer-motion';
import FlashSaleCountdown from './FlashSaleCountdown';
import { FlashSale } from '../../../store/slices/flashSalesSlice';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../store/slices/cartSlice';
import { FaShoppingCart, FaBolt } from 'react-icons/fa';

interface FlashSaleCardProps {
  sale: FlashSale;
}

const FlashSaleCard: React.FC<FlashSaleCardProps> = ({ sale }) => {
  const dispatch = useDispatch();

  const calculateProgress = (product: any) => {
    return (product.soldCount / product.quantity) * 100;
  };

  const handleAddToCart = (product: any) => {
    dispatch(addToCart({
      ...product,
      price: product.salePrice,
      isFlashSale: true,
      flashSaleId: sale.id
    }));
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
    >
      <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaBolt className="text-yellow-300 text-xl animate-pulse" />
            <h3 className="text-xl font-bold">{sale.name}</h3>
          </div>
          <FlashSaleCountdown 
            endTime={sale.endTime} 
            size="sm"
          />
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
                      ${product.salePrice}
                    </span>
                    <span className="text-gray-400 line-through text-sm">
                      ${product.originalPrice}
                    </span>
                    <span className="bg-red-100 text-red-500 text-xs px-2 py-1 rounded">
                      {Math.round((1 - product.salePrice / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
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

export default FlashSaleCard;
