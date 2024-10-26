import { json, type LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { motion } from 'framer-motion';
import { requireUser } from '~/services/auth.server';
import { getUserOrders } from '~/services/orders.server';
import OrderItem from '~/components/orders/OrderItem';
import type { Order } from '~/types';

interface LoaderData {
  orders: Order[];
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  const orders = await getUserOrders(user.id);
  return json<LoaderData>({ orders });
};

export default function Orders() {
  const { orders } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>

      <div className="space-y-4">
        <AnimatePresence>
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <OrderItem order={order} />
            </motion.div>
          ))}
        </AnimatePresence>

        {orders.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500"
          >
            You have no past orders.
          </motion.p>
        )}
      </div>
    </div>
  );
}
