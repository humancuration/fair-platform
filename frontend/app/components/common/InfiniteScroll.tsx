import { useEffect, useRef, type ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

interface InfiniteScrollProps {
  children: ReactNode;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isLoading?: boolean;
  loadingComponent?: ReactNode;
  className?: string;
}

export default function InfiniteScroll({
  children,
  hasNextPage,
  fetchNextPage,
  isLoading = false,
  loadingComponent = <DefaultLoader />,
  className = ''
}: InfiniteScrollProps) {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView && hasNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isLoading, fetchNextPage]);

  return (
    <div className={className}>
      {children}
      
      {(hasNextPage || isLoading) && (
        <div ref={ref} className="py-4">
          {loadingComponent}
        </div>
      )}
    </div>
  );
}

function DefaultLoader() {
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="flex justify-center items-center p-4"
    >
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </motion.div>
  );
}

// Example usage in a route:
/*
export default function ProductList() {
  const { products, hasNextPage, fetchNextPage, isLoading } = useLoaderData<typeof loader>();

  return (
    <InfiniteScroll
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      isLoading={isLoading}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </InfiniteScroll>
  );
}
*/
