import { json, type LoaderFunction } from '@remix-run/node';
import { useLoaderData, useSearchParams, Form } from '@remix-run/react';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { SEARCH_PRODUCTS } from '../graphql/queries';
import ProductCard from '../components/ProductCard';
import SearchFilters from '../components/SearchFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import type { SearchResult } from '../types';

interface LoaderData {
  initialResults: SearchResult[];
  totalCount: number;
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  
  const { results, totalCount } = await performInitialSearch(query, page);
  
  return json<LoaderData>({ 
    initialResults: results,
    totalCount 
  });
};

const SearchResultsPage = () => {
  const { initialResults, totalCount } = useLoaderData<LoaderData>();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const { ref, inView } = useInView();
  
  const { data, loading, fetchMore } = useQuery(SEARCH_PRODUCTS, {
    variables: { 
      query,
      page: 1,
      filters: getFiltersFromParams(searchParams)
    },
    notifyOnNetworkStatusChange: true
  });

  const results = data?.searchResults || initialResults;

  useEffect(() => {
    if (inView && !loading && results.length < totalCount) {
      fetchMore({
        variables: {
          page: Math.ceil(results.length / 20) + 1
        }
      });
    }
  }, [inView, loading, results.length, totalCount]);

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

      {loading && <LoadingSpinner />}
      
      <div ref={ref} className="h-20" />
    </div>
  );
};

export default SearchResultsPage;
