import { json, type LoaderFunction } from '@remix-run/node';
import { useLoaderData, useSearchParams, Form } from '@remix-run/react';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';
import { getSearchResults } from '~/services/search.server';
import ProductCard from '~/components/products/ProductCard';
import SearchFilters from '~/components/search/SearchFilters';
import type { SearchResult } from '~/types';

interface LoaderData {
  results: SearchResult[];
  totalCount: number;
  query: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  const filters = Object.fromEntries(url.searchParams);
  
  const { results, totalCount } = await getSearchResults({ query, page, filters });
  
  return json<LoaderData>({ 
    results,
    totalCount,
    query
  });
};

export default function Search() {
  const { results, totalCount, query } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const { ref, inView } = useInView();

  return (
    <div className="container mx-auto p-4">
      <Form method="get" className="mb-6">
        <SearchFilters />
      </Form>

      <h2 className="text-xl font-semibold mb-4">
        {totalCount} Results for "{query}"
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatePresence>
          {results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard product={result} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div ref={ref} className="h-20" />
    </div>
  );
}
