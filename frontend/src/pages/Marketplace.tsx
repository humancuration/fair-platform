import React, { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react';
import { useQuery } from 'react-query';
import { fetchProducts, searchProducts, fetchRecommendations } from '../api/api';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';
import RecommendationCarousel from '../components/RecommendationCarousel';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import '../i18n'; // Import the i18n configuration

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log error to monitoring service
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong.</h2>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="product-card">
      <Skeleton height={200} />
      <Skeleton count={2} />
    </div>
  );
};

// Use skeletons while loading
if (isLoading) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}


// Define Product interface
interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  // Add other relevant fields
}

const Marketplace: React.FC = () => {
  const { t } = useTranslation();
  return (
    <h1>{t('marketplace.title')}</h1>
  );
};
const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('es')}>Español</button>
    </div>
  );
};

  const [products, setProducts] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const productsPerPage = 12;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);
  const [sortOption, setSortOption] = useState('price-asc');
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };
  
  // Sorting options component
  <select value={sortOption} onChange={handleSortChange}>
    <option value="price-asc">Price: Low to High</option>
    <option value="price-desc">Price: High to Low</option>
    <option value="rating-desc">Rating</option>
    // Add more options
  </select>
  const [wishlist, setWishlist] = useState<Product[]>([]);

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => [...prev, product]);
  };
  // Add a button to add to wishlist
  <button onClick={() => addToWishlist(product)}>
    Add to Wishlist
  </button>

  
  const { data, isLoading, error } = useQuery<Product[]>('products', fetchProducts, {
    onSuccess: (data) => {
      setProducts(data);
    },
  });

  const loadMore = useCallback(async () => {
    if (!hasMore) return;
    try {
      const response = await fetchProducts({ page });
      setProducts((prev) => [...prev, ...response.data]);
      if (response.data.length === 0) {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  }, [page, hasMore]);

  useEffect(() => {
    if (data) {
      setProducts(data);
    }
  }, [data]);

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  useEffect(() => {
  const sortedProducts = [...products].sort((a, b) => {
    // Implement sorting logic based on sortOption
  });
  setProducts(sortedProducts);
  }, [sortOption]);


  const handleSearch = useCallback(async (query: string) => {
    try {
      const response = await searchProducts({ query, ...filters });
      setProducts(response.data);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error searching products:', err);
    }
  }, [filters]);

  const handleFilterChange = async (newFilters: object) => {
    setFilters(newFilters);
    try {
      const response = await searchProducts({ ...newFilters });
      setProducts(response.data);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error applying filters:', err);
    }
  };
  const categories = ['Electronics', 'Books', 'Clothing'];

  return (
    <div>
      <h3>Categories</h3>
      {categories.map((category) => (
       <label key={category}>
          <input
           type="checkbox"
           value={category}
           onChange={handleCategoryChange}
         />
         {category}
        </label>
      ))}
    </div>
  );
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
  
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
  
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
  
    return debouncedValue;
  };
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery]);
  
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const ReviewSection: React.FC<{ productId: number }> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  
    useEffect(() => {
      // Fetch reviews for the product
    }, [productId]);
  
    return (
      <div>
        {reviews.map((review) => (
          <div key={review.id}>
            <p>{review.comment}</p>
            <p>Rating: {review.rating}</p>
          </div>
        ))}
      </div>
    );
  };
  const [user, setUser] = useState<User | null>(null);

  // Update user state upon login/signup

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  const Marketplace: React.FC = () => {
    return (
      <>
        <Helmet>
          <title>Marketplace - Your Site Name</title>
          <meta name="description" content="Browse products on our marketplace." />
          {/* Add more meta tags */}
        </Helmet>
        {/* Rest of the component */}
      </>
    );
  };
  return (
    <motion.div
      key="marketplace"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Marketplace</h1>
        <RecommendationCarousel recommendations={recommendations} />
        <SearchBar onSearch={handleSearch} />
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/4 px-4">
            <FilterSidebar onFilterChange={handleFilterChange} />
          </div>
          <div className="w-full md:w-3/4 px-4">
            <Suspense fallback={<div>Loading products...</div>}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </Suspense>
            <div ref={loader}>{hasMore && <p>Loading more products...</p>}</div>
            <Pagination
              productsPerPage={productsPerPage}
              totalProducts={products.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Marketplace;
