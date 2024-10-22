import { useState, useRef } from 'react';
import { Link } from '@remix-run/react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Button from '../../components/common/Button';
import AvatarItemPreview from './AvatarItemPreview';
import { Product } from '../../types/Product';
import { FaHeart, FaRegHeart, FaEye, FaShoppingCart } from 'react-icons/fa';

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

export default function ProductCard({
  product,
  onAddToCart,
  onRemoveFromCart,
  onAddToWishlist,
  onRemoveFromWishlist,
  onQuickView,
  isInCart,
  isInWishlist,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const cardVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="border rounded-lg overflow-hidden shadow-lg relative bg-white dark:bg-gray-800"
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative h-48">
        {product.model3D ? (
          <Canvas>
            <OrbitControls enableZoom={false} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <primitive object={product.model3D} scale={0.5} />
          </Canvas>
        ) : (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-300"
            style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
          />
        )}
        
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-full ${isInWishlist ? 'bg-red-500' : 'bg-white'}`}
            onClick={() => isInWishlist ? onRemoveFromWishlist(product.id) : onAddToWishlist(product)}
          >
            {isInWishlist ? <FaHeart className="text-white" /> : <FaRegHeart />}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-white"
            onClick={() => onQuickView(product)}
          >
            <FaEye />
          </motion.button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          {product.discount > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">
              -{product.discount}%
            </span>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center mb-4">
          <div>
            {product.discount > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-red-500">
                  ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>
          {product.stock <= 5 && product.stock > 0 && (
            <span className="text-sm text-orange-500">
              Only {product.stock} left!
            </span>
          )}
        </div>

        <motion.div
          initial={false}
          animate={isInCart ? "added" : "default"}
          variants={{
            added: { scale: 1.1 },
            default: { scale: 1 }
          }}
        >
          <Button
            onClick={() => isInCart ? onRemoveFromCart(product.id) : onAddToCart(product)}
            disabled={product.stock === 0}
            className="w-full flex items-center justify-center gap-2"
            variant={isInCart ? "secondary" : "primary"}
          >
            <FaShoppingCart />
            {product.stock === 0 ? "Out of Stock" :
              isInCart ? "Remove from Cart" : "Add to Cart"}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
