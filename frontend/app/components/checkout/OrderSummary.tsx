import { useLoaderData } from '@remix-run/react';
import { motion } from 'framer-motion';
import { formatCurrency } from '~/utils/formatters';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderSummaryProps {
  items: CartItem[];
  className?: string;
}

export default function OrderSummary({ 
  items,
  className = '' 
}: OrderSummaryProps) {
  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity, 
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow ${className}`}
    >
      <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
      
      <div className="space-y-3">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="flex justify-between items-center py-2 border-b dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              {item.image && (
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-12 h-12 rounded object-cover"
                />
              )}
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Qty: {item.quantity}
                </p>
              </div>
            </div>
            <p className="font-medium">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t dark:border-gray-700">
        <div className="flex justify-between items-center font-bold text-lg">
          <span>Total:</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
      </div>
    </motion.div>
  );
}
