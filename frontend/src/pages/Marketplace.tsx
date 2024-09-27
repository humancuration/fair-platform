import React, { useState, useEffect } from 'react';
import { fetchProducts, searchProducts, fetchRecommendations } from '../services/api';
import ProductCard from  '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';
import RecommendationCarousel from '../components/RecommendationCarousel';

const Marketplace: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const productsPerPage = 12;

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [productsResponse, recommendationsResponse] = await Promise.all([
        fetchProducts(),
        fetchRecommendations()
      ]);
      setProducts(productsResponse.data);
      setRecommendations(recommendationsResponse.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again later.');
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      setLoading(true);
      const response = await searchProducts({ query, ...filters });
      setProducts(response.data);
      setCurrentPage(1);
      setLoading(false);
    } catch (err) {
      console.error('Error searching products:', err);
      setError('Failed to search products. Please try again.');
      setLoading(false);
    }
  };

  const handleFilterChange = async (newFilters: object) => {
    setFilters(newFilters);
    try {
      setLoading(true);
      const response = await searchProducts({ ...newFilters });
      setProducts(response.data);
      setCurrentPage(1);
      setLoading(false);
    } catch (err) {
      console.error('Error applying filters:', err);
      setError('Failed to apply filters. Please try again.');
      setLoading(false);
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Marketplace</h1>
      <RecommendationCarousel recommendations={recommendations} />
      <SearchBar onSearch={handleSearch} />
      <div className="flex flex-wrap -mx-4">
        <div className="w-full md:w-1/4 px-4">
          <FilterSidebar onFilterChange={handleFilterChange} />
        </div>
        <div className="w-full md:w-3/4 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination
            productsPerPage={productsPerPage}
            totalProducts={products.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
