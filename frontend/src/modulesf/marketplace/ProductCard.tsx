import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import AvatarItemPreview from './AvatarItemPreview';
import { Product } from '../../types/Product';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
  onAddToWishlist: (product: Product) => void;
  onRemoveFromWishlist: (productId: string) => void;
  onQuickView: (product: Product) => void;
  isInCart: boolean;
  isInWishlist: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onRemoveFromCart,
  onAddToWishlist,
  onRemoveFromWishlist,
  onQuickView,
  isInCart,
  isInWishlist,
}) => {
  const isAvatarItem = product.type && ['background', 'outfit', 'accessory'].includes(product.type);

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg relative">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <p className="text-xl font-bold mb-4">${product.price.toFixed(2)}</p>
        <div className="flex justify-between items-center">
          {isInCart ? (
            <Button onClick={() => onRemoveFromCart(product.id)} variant="secondary">Remove from Cart</Button>
          ) : (
            <Button onClick={() => onAddToCart(product)}>Add to Cart</Button>
          )}
          <button
            onClick={() => isInWishlist ? onRemoveFromWishlist(product.id) : onAddToWishlist(product)}
            className="text-red-500 hover:text-red-700"
          >
            {isInWishlist ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
          </button>
        </div>
        <Button onClick={() => onQuickView(product)} fullWidth className="mt-2">Quick View</Button>
      </div>
      {isAvatarItem && (
        <div className="p-4 bg-gray-100">
          <AvatarItemPreview product={product} />
        </div>
      )}
    </div>
  );
};

export default ProductCard;
