import React, { useState, useEffect } from 'react';
import { Link } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaTimes } from 'react-icons/fa';
import Button from '../components/common/Button';

interface CartPreviewProps {
  cart: CartState;
  onRemoveItem: (productId: number) => void;
}

const CartPreview: React.FC<CartPreviewProps> = ({ cart, onRemoveItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (cart.items.length > 0 && !isOpen) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  }, [cart.items.length]);

  return (
    <div className="fixed top-20 right-4 z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary-500 text-white p-3 rounded-full shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
      >
        <div className="relative">
          <FaShoppingCart size={24} />
          {cart.items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cart.items.length}
            </span>
          )}
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Shopping Cart</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              {cart.items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <Button onClick={() => setIsOpen(false)}>
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <>
                  <div className="max-h-96 overflow-y-auto">
                    <AnimatePresence>
                      {cart.items.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-4 py-2 border-b"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-gray-500">${item.price}</p>
                          </div>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTimes />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between mb-4">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold">${cart.total.toFixed(2)}</span>
                    </div>
                    <Link
                      to="/checkout"
                      className="block w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button fullWidth>Proceed to Checkout</Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartPreview;
