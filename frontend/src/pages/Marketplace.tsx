import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from 'react-query';
import { fetchProducts, searchProducts } from '../api/api';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import RecommendationCarousel from '../components/RecommendationCarousel';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import InfiniteScrollComponent from '../components/infiniteScrollComponent';
import ProductCard from '../components/marketplace/ProductCard';

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
}

const Marketplace: React.FC = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [recommendations, _setRecommendations] = useState<Product[]>([]);
  const [filters, setFilters] = useState({});
  const [sortOption, setSortOption] = useState('price-asc');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const productsPerPage = 12;
  const { isLoading, error } = useQuery<{ data: Product[] }>('products', 
    () => fetchProducts({ 
      page: 1, 
      limit: productsPerPage, 
      filters, 
      sort: sortOption, 
      query 
    }),
    {
      onSuccess: (response) => {
        setProducts(response.data.slice(0, productsPerPage));
      }
    }
  );

  const fetchMoreData = useCallback(async () => {
    try {
      const response = await fetchProducts({ page: page + 1, limit: productsPerPage, filters, sort: sortOption, query });
      const newProducts = response.data;
      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setPage((prevPage) => prevPage + 1);
        setProducts((prevProducts) => [...prevProducts, ...newProducts]);
      }
      return newProducts;
    } catch (err) {
      console.error('Error fetching more products:', err);
      setHasMore(false);
      return [];
    }
  }, [page, filters, sortOption, query]);

  const handleSearch = useCallback(async (searchQuery: string) => {
    setQuery(searchQuery);
    try {
      const response = await searchProducts({ query: searchQuery, ...filters, sort: sortOption });
      setProducts(response.data.slice(0, productsPerPage));
      setHasMore(response.data.length > productsPerPage);
      setPage(1);
    } catch (err) {
      console.error('Error searching products:', err);
    }
  }, [filters, sortOption]);

  const handleFilterChange = async (newFilters: object) => {
    setFilters(newFilters);
    try {
      const response = await searchProducts({ ...newFilters, query, sort: sortOption });
      setProducts(response.data.slice(0, productsPerPage));
      setHasMore(response.data.length > productsPerPage);
      setPage(1);
    } catch (err) {
      console.error('Error applying filters:', err);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  useEffect(() => {
    const sortedProducts = [...products].sort((a, b) => {
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      return 0;
    });
    setProducts(sortedProducts);
  }, [sortOption]);

  if (isLoading) return <Skeleton count={12} />;
  if (error) return <div>Error: {(error as Error)?.message || 'An error occurred'}</div>;
  return (
    <motion.div
      key="marketplace"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Helmet>
        <title>{t('marketplace.title')} - Fair Market</title>
        <meta name="description" content={t('marketplace.description')} />
      </Helmet>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">{t('marketplace.title')}</h1>
        <RecommendationCarousel products={recommendations} />
        <SearchBar onSearch={handleSearch} />
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/4 px-4">
            <FilterSidebar onFilterChange={handleFilterChange} />
          </div>
          <div className="w-full md:w-3/4 px-4">
            <select value={sortOption} onChange={handleSortChange} className="mb-4">
              <option value="price-asc">{t('marketplace.sortPriceAsc')}</option>
              <option value="price-desc">{t('marketplace.sortPriceDesc')}</option>
            </select>
            <InfiniteScrollComponent<Product>
              fetchMoreData={fetchMoreData}
              hasMore={hasMore}
              renderItem={(product: Product) => <ProductCard key={product.id} product={product} />}
              initialData={products}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Marketplace;
