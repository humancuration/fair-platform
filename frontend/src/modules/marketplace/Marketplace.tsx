import { useState, useEffect } from 'react';
import { useLoaderData, useSubmit, Form } from '@remix-run/react';
import { json, LoaderFunction } from '@remix-run/node';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, searchProducts, fetchRecommendations } from '../../store/slices/marketplaceSlice';
import { addToCart, removeFromCart } from '../../store/slices/cartSlice';
import { addWishlistItem, removeWishlistItem } from '../../store/slices/wishlistSlice';
import { RootState } from '../../store/store';
import Layout from '../../components/Layout';
import ProductCard from './ProductCard';
import FilterSidebar from '../components/marketplace/FilterSidebar';
import SearchBar from '../../components/common/SearchBar';
import RecommendationCarousel from '../components/marketplace/RecommendationCarousel';
import CartPreview from '../components/marketplace/CartPreview';
import Pagination from '../../components/common/Pagination';
import QuickViewModal from '../components/marketplace/QuickViewModal';
import { Product } from '../types/Product';
import { debounce } from 'lodash';
import { toast } from 'react-toastify';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const category = url.searchParams.get('category') || 'all';
  const sortOption = url.searchParams.get('sort') || 'price-asc';
  const query = url.searchParams.get('query') || '';

  // Fetch products and recommendations from your API
  const products = await fetchProductsFromAPI(page, category, sortOption, query);
  const recommendations = await fetchRecommendationsFromAPI();

  return json({ products, recommendations, page, category, sortOption, query });
};

export default function Marketplace() {
  const { products, recommendations, page, category, sortOption, query } = useLoaderData<typeof loader>();
  const dispatch = useDispatch();
  const submit = useSubmit();
  const cart = useSelector((state: RootState) => state.cart);
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleFilterChange = (newFilters: any) => {
    submit({ ...newFilters, page: '1' }, { method: 'get' });
  };

  const handleSearch = (searchQuery: string) => {
    submit({ query: searchQuery, page: '1' }, { method: 'get' });
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
            <Form method="get" className="flex justify-between items-center mb-4">
              <select name="category" defaultValue={category} className="p-2 border rounded">
                <option value="all">All Categories</option>
                <option value="backgrounds">Backgrounds</option>
                <option value="outfits">Outfits</option>
                <option value="accessories">Accessories</option>
              </select>
              <select name="sort" defaultValue={sortOption} className="p-2 border rounded">
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </Form>
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
              currentPage={page}
              totalPages={10} // Replace with actual total pages
              onPageChange={(newPage) => submit({ page: newPage.toString() }, { method: 'get' })}
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
}
