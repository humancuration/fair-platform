import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, searchProducts, fetchRecommendations } from '../store/slices/marketplaceSlice';
import { addToCart, removeFromCart } from '../store/slices/cartSlice';
import { addWishlistItem, removeWishlistItem } from '../store/slices/wishlistSlice';
import { RootState } from '../store/store';
import Layout from '../../components/Layout';
import ProductCard from './ProductCard';
import FilterSidebar from './FilterSidebar';
import SearchBar from '../../components/common/SearchBar';
import RecommendationCarousel from './RecommendationCarousel';
import CartPreview from './CartPreview';
import Pagination from '../../components/common/Pagination';
import QuickViewModal from './QuickViewModal';
import { Product } from '../../types/Product';
import { debounce } from 'lodash';
import { toast } from 'react-toastify';

const Marketplace: React.FC = () => {
  const dispatch = useDispatch();
  const { products, recommendations, status, error, totalPages } = useSelector((state: RootState) => state.marketplace);
  const cart = useSelector((state: RootState) => state.cart);
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const [filters, setFilters] = useState({});
  const [category, setCategory] = useState('all');
  const [sortOption, setSortOption] = useState('price-asc');
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      dispatch(searchProducts({ query: searchQuery, filters, sort: sortOption, category, page: 1 }));
    }, 300),
    [filters, sortOption, category]
  );

  useEffect(() => {
    dispatch(fetchProducts({ filters, sort: sortOption, category, page: currentPage }));
    dispatch(fetchRecommendations());
  }, [dispatch, filters, sortOption, category, currentPage]);

  useEffect(() => {
    if (query) {
      debouncedSearch(query);
    }
  }, [query, debouncedSearch]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setCurrentPage(1);
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    toast.success(`Added ${product.name} to cart`);
  };

  const handleRemoveFromCart = (productId: number) => {
    dispatch(removeFromCart(productId));
    toast.info(`Removed item from cart`);
  };

  const handleAddToWishlist = (product: Product) => {
    dispatch(addWishlistItem(product));
    toast.success(`Added ${product.name} to wishlist`);
  };

  const handleRemoveFromWishlist = (productId: string) => {
    dispatch(removeWishlistItem(productId));
    toast.info(`Removed item from wishlist`);
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Marketplace</h1>
        
        <RecommendationCarousel products={recommendations} onAddToCart={handleAddToCart} onQuickView={handleQuickView} />

        <div className="mb-8">
          <SearchBar onSearch={handleSearch} placeholder="Search products..." />
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <FilterSidebar onFilterChange={handleFilterChange} />
          </div>
          <div className="w-full md:w-3/4 md:pl-8">
            <div className="flex justify-between items-center mb-4">
              <select value={category} onChange={handleCategoryChange} className="p-2 border rounded">
                <option value="all">All Categories</option>
                <option value="backgrounds">Backgrounds</option>
                <option value="outfits">Outfits</option>
                <option value="accessories">Accessories</option>
              </select>
              <select value={sortOption} onChange={handleSortChange} className="p-2 border rounded">
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onRemoveFromCart={handleRemoveFromCart}
                  onAddToWishlist={handleAddToWishlist}
                  onRemoveFromWishlist={handleRemoveFromWishlist}
                  onQuickView={handleQuickView}
                  isInCart={cart.items.some(item => item.id === product.id)}
                  isInWishlist={wishlist.some(item => item.id === product.id)}
                />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
      <CartPreview cart={cart} onRemoveItem={handleRemoveFromCart} />
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
        />
      )}
    </Layout>
  );
};

export default Marketplace;
