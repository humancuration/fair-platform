import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CartState } from '../store/slices/cartSlice';

interface CartPreviewProps {
  cart: CartState;
  onRemoveItem: (productId: number) => void;
}

const CartPreview: React.FC<CartPreviewProps> = ({ cart, onRemoveItem }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="fixed top-20 right-4 z-50">
      <button
        onClick={toggleOpen}
        className="bg-blue-500 text-white p-2 rounded-full shadow-lg"
      >
        Cart ({cart.items.length})
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl p-4">
          <h3 className="text-lg font-semibold mb-2">Cart</h3>
          {cart.items.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              <ul className="max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <li key={item.id} className="flex justify-between items-center mb-2">
                    <span>{item.name}</span>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <p className="font-semibold">Total: ${cart.total.toFixed(2)}</p>
                <Link
                  to="/checkout"
                  className="block w-full text-center bg-green-500 text-white py-2 px-4 rounded mt-2 hover:bg-green-600"
                >
                  Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CartPreview;
