import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../modules/marketplace/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../api/api';
import { handleError } from '../../app/utils/error-handler-client';
import ShareWithGroupModal from '../modules/group/ShareWithGroupModal';

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

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
  };

  if (loading) return <LoadingSpinner />;
  return (
    <Layout>
      <div className="container mx-auto p-4">
        {product ? (
          <ProductCard 
            product={product}
            onAddToCart={handleAddToCart}
          />
        ) : (
          <p className="text-center text-xl">Product not found</p>
        )}
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Share with Group
        </button>

        <ShareWithGroupModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          productId={product?.id}
        />
      </div>
    </Layout>
  );
};

export default ProductDetailsPage;
