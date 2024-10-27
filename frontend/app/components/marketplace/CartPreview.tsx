import type { FC } from 'react';
import { Link, Form } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaTimes } from 'react-icons/fa';
import { formatCurrency } from '~/utils/formatters';
import type { CartItem } from '~/types/marketplace';

interface CartPreviewProps {
  items: CartItem[];
  total: number;
  onClose: () => void;
}

export const CartPreview: FC<CartPreviewProps> = ({ items, total, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed top-20 right-4 w-96 bg-white rounded-lg shadow-xl z-50"
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Shopping Cart</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close cart"
          >
            <FaTimes />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Link
              to="/marketplace"
              onClick={onClose}
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="max-h-96 overflow-y-auto">
              <AnimatePresence>
                {items.map((item) => (
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
                      <div className="flex items-center gap-2">
                        <Form method="post" className="inline">
                          <input type="hidden" name="intent" value="updateQuantity" />
                          <input type="hidden" name="itemId" value={item.id} />
                          <select
                            name="quantity"
                            defaultValue={item.quantity}
                            onChange={(e) => e.target.form?.submit()}
                            className="border rounded p-1"
                          >
                            {[1, 2, 3, 4, 5].map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                        </Form>
                        <span className="text-gray-500">
                          × {formatCurrency(item.price)}
                        </span>
                      </div>
                    </div>
                    <Form method="post">
                      <input type="hidden" name="intent" value="removeFromCart" />
                      <input type="hidden" name="itemId" value={item.id} />
                      <button
                        type="submit"
                        className="text-red-500 hover:text-red-700"
                        aria-label="Remove item"
                      >
                        <FaTimes />
                      </button>
                    </Form>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between mb-4">
                <span className="font-semibold">Total:</span>
                <span className="font-bold">{formatCurrency(total)}</span>
              </div>
              <Link
                to="/marketplace/checkout"
                onClick={onClose}
                className="block w-full px-4 py-2 bg-blue-500 text-white text-center rounded hover:bg-blue-600 transition"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};
