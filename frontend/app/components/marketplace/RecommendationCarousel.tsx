import type { FC } from 'react';
import { Link } from '@remix-run/react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import type { Product } from '~/types/marketplace';

interface RecommendationCarouselProps {
  products: Product[];
}

export const RecommendationCarousel: FC<RecommendationCarouselProps> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerPage >= products.length ? 0 : prev + itemsPerPage
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev - itemsPerPage < 0 ? Math.max(0, products.length - itemsPerPage) : prev - itemsPerPage
    );
  };

  if (!products.length) return null;

  return (
    <div className="relative mb-8">
      <h2 className="text-2xl font-semibold mb-4">Recommended for You</h2>
      
      <div className="relative overflow-hidden">
        <motion.div
          className="flex gap-4"
          initial={false}
          animate={{ x: `-${currentIndex * (100 / itemsPerPage)}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              className="flex-none w-full md:w-1/3"
              whileHover={{ scale: 1.02 }}
            >
              <Link 
                to={`/marketplace/${product.id}`}
                prefetch="intent" 
                className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="relative h-48">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                      -{product.discount}%
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <div className="flex justify-between items-center">
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
                        <span className="text-xl font-bold">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {products.length > itemsPerPage && (
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition"
            aria-label="Previous slide"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition"
            aria-label="Next slide"
          >
            <FaChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
