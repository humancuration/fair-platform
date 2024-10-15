import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, searchProducts, fetchRecommendations } from '../store/slices/marketplaceSlice';
import { addToCart } from '../store/slices/cartSlice';
import { RootState } from '../store/store';
import Layout from '../components/Layout';
import ProductCard from '../components/marketplace/ProductCard';
import FilterSidebar from '../components/marketplace/FilterSidebar';
import SearchBar from '../components/common/SearchBar';
import InfiniteScrollComponent from '../components/common/InfiniteScrollComponent';
import RecommendationCarousel from '../components/marketplace/RecommendationCarousel';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { Product } from '../types/Product';
import { debounce } from 'lodash';
import { toast } from 'react-toastify';

const Marketplace: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { products, recommendations, status, error } = useSelector((state: RootState) => state.marketplace);
  const [filters, setFilters] = useState({});
  const [sortOption, setSortOption] = useState('price-asc');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      dispatch(searchProducts({ query: searchQuery, filters, sort: sortOption }));
    }, 300),
    [filters, sortOption]
  );

  useEffect(() => {
    dispatch(fetchProducts({ page, filters, sort: sortOption }));
    dispatch(fetchRecommendations());
  }, [dispatch, page, filters, sortOption]);

  useEffect(() => {
    if (query) {
      debouncedSearch(query);
    }
  }, [query, debouncedSearch]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
    setPage(1);
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1);
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    toast.success(t('marketplace.addedToCart', { name: product.name }));
  };

  const fetchMoreData = () => {
    if (status !== 'loading' && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
    if (sortOption === 'name-desc') return b.name.localeCompare(a.name);
    return 0;
  });

  if (status === 'loading' && page === 1) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Layout>
      <motion.div
        key="marketplace"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto px-4 py-8"
      >
        <h1 className="text-4xl font-bold mb-8">{t('marketplace.title')}</h1>
        
        <RecommendationCarousel products={recommendations} onAddToCart={handleAddToCart} />

        <div className="mb-8">
          <SearchBar onSearch={handleSearch} placeholder={t('marketplace.searchPlaceholder')} />
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <FilterSidebar onFilterChange={handleFilterChange} />
          </div>
          <div className="w-full md:w-3/4 md:pl-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">{t('marketplace.productsTitle')}</h2>
              <select value={sortOption} onChange={handleSortChange} className="p-2 border rounded">
                <option value="price-asc">{t('marketplace.sortPriceAsc')}</option>
                <option value="price-desc">{t('marketplace.sortPriceDesc')}</option>
                <option value="name-asc">{t('marketplace.sortNameAsc')}</option>
                <option value="name-desc">{t('marketplace.sortNameDesc')}</option>
              </select>
            </div>
            <AnimatePresence>
              <InfiniteScrollComponent<Product>
                fetchMoreData={fetchMoreData}
                hasMore={hasMore}
                renderItem={(product: Product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} onAddToCart={handleAddToCart} />
                  </motion.div>
                )}
                initialData={sortedProducts}
              />
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Marketplace;
