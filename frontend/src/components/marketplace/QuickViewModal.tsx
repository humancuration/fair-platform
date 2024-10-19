import React from 'react';
import { Product } from '../../types/Product';
import Button from '../common/Button';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  onRemoveFromWishlist: (productId: string) => void;
  isInWishlist: boolean;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onAddToWishlist,
  onRemoveFromWishlist,
  isInWishlist,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-2xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <div className="flex">
          <div className="w-1/2">
            <img src={product.image} alt={product.name} className="w-full h-auto" />
          </div>
          <div className="w-1/2 pl-8">
            <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-xl font-semibold mb-4">${product.price.toFixed(2)}</p>
            <div className="space-y-2">
              <Button onClick={() => onAddToCart(product)} fullWidth>
                Add to Cart
              </Button>
              <Button 
                onClick={() => isInWishlist ? onRemoveFromWishlist(product.id) : onAddToWishlist(product)} 
                variant="secondary" 
                fullWidth
              >
                {isInWishlist ? (
                  <>
                    <FaHeart className="inline-block mr-2" />
                    Remove from Wishlist
                  </>
                ) : (
                  <>
                    <FaRegHeart className="inline-block mr-2" />
                    Add to Wishlist
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
