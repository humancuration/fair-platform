import React from 'react';

interface OrderItemProps {
  order: {
    id: string;
    date: string;
    total: number;
    status: string;
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
    }>;
  };
}

const OrderItem: React.FC<OrderItemProps> = ({ order }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Order #{order.id}</h3>
        <span className="text-sm text-gray-500">{order.date}</span>
      </div>
      <div className="mb-2">
        <span className="font-medium">Status: </span>
        <span className={`capitalize ${order.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
          {order.status}
        </span>
      </div>
      <ul className="mb-2">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between text-sm">
            <span>{item.name} (x{item.quantity})</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="text-right font-semibold">
        Total: ${order.total.toFixed(2)}
      </div>
    </div>
  );
};

export default OrderItem;
