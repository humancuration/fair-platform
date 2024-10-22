import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bundle } from '../../../store/slices/productBundlesSlice';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../store/slices/cartSlice';
import { FaShoppingCart, FaGift, FaChevronDown } from 'react-icons/fa';

interface BundleCardProps {
  bundle: Bundle;
}

const BundleCard: React.FC<BundleCardProps> = ({ bundle }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useDispatch();

  const savings = bundle.totalPrice - bundle.discountedPrice;
  const savingsPercentage = (savings / bundle.totalPrice) * 100;

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: bundle.id,
      name: bundle.name,
      price: bundle.discountedPrice,
      image: bundle.imageUrl,
      isBundle: true,
      products: bundle.products
    }));
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
    >
      <div className="relative">
        <img
          src={bundle.imageUrl}
          alt={bundle.name}
          className="w-full h-48 object-cover"
        />
        {bundle.featured && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">
            Featured
          </div>
        )}
        {bundle.limitedQuantity && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
            Limited Edition
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{bundle.name}</h3>
        <p className="text-gray-600 mb-4">{bundle.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-green-500">
              ${bundle.discountedPrice}
            </span>
            <span className="text-gray-400 line-through ml-2">
              ${bundle.totalPrice}
            </span>
          </div>
          <div className="text-green-500 font-semibold">
            Save {savingsPercentage.toFixed(0)}%
          </div>
        </div>

        <button
          className="flex items-center justify-between w-full text-gray-600 hover:text-gray-800"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="flex items-center gap-2">
            <FaGift />
            {bundle.products.length} items included
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
          >
            <FaChevronDown />
          </motion.div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 space-y-2"
            >
              {bundle.products.map((product) => (
                <div
                  key={product.productId}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                >
                  <img
                    src={product.product.image}
                    alt={product.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{product.product.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {product.quantity} | -{product.discountPercentage}%
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {bundle.limitedQuantity && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Sold: {bundle.soldCount}</span>
              <span>Remaining: {bundle.limitedQuantity - bundle.soldCount}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-green-500"
                initial={{ width: 0 }}
                animate={{ width: `${(bundle.soldCount / bundle.limitedQuantity) * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={bundle.limitedQuantity && bundle.soldCount >= bundle.limitedQuantity}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 flex items-center justify-center gap-2"
        >
          <FaShoppingCart />
          Add Bundle to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default BundleCard;
