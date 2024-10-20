import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../modulesf/store/RootState';
import { CartItem } from '../modulesf/store/slices/cartSlice';

const CheckoutOrderSummary: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const totalPrice = cartItems.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
      <ul>
        {cartItems.map((item: CartItem) => (
          <li key={item.id} className="flex justify-between mb-2">
            <span>{item.name} (x{item.quantity})</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <hr className="my-4" />
      <div className="flex justify-between font-bold">
        <span>Total:</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default CheckoutOrderSummary;
