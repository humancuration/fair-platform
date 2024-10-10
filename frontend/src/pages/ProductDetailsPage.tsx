import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../utils/api';
import { handleError } from '../utils/errorHandler';
import ShareWithGroupModal from '../components/ShareWithGroupModal'; // Import the Share Modal

const ProductDetailsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      <div className="container mx-auto p-4">
        {product ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img src={product.image} alt={product.name} className="w-full h-auto rounded-lg shadow-lg" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{product.description}</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">${product.price.toFixed(2)}</p>
              <Button onClick={() => {/* TODO: Implement add to cart functionality */}}>
                Add to Cart
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-center text-xl">Product not found</p>
        )}
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Share with Group
        </button>

        {{ /* Share with Group Modal */ }}
        <ShareWithGroupModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          productId={/* pass the current product ID */}
        />
      </div>
    </Layout>
  );
};

export default ProductDetailsPage;