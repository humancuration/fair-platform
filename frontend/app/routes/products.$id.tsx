import { json, type LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { motion } from 'framer-motion';
import { getProduct } from '~/services/products.server';
import ProductDetails from '~/components/products/ProductDetails';
import ShareWithGroupModal from '~/components/groups/ShareWithGroupModal';
import { useState } from 'react';
import type { Product } from '~/types';

interface LoaderData {
  product: Product;
}

export const loader: LoaderFunction = async ({ params }) => {
  const product = await getProduct(params.id);
  if (!product) {
    throw new Response('Not Found', { status: 404 });
  }
  return json<LoaderData>({ product });
};

export default function ProductDetailsPage() {
  const { product } = useLoaderData<typeof loader>();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ProductDetails product={product} />

        <button
          onClick={() => setIsShareModalOpen(true)}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Share with Group
        </button>

        <ShareWithGroupModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          productId={product.id}
        />
      </motion.div>
    </div>
  );
}
