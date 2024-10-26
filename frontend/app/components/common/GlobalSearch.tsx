import { useState, useEffect } from 'react';
import { Form, useSearchParams, useSubmit } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '~/hooks/useDebounce';
import SearchBar from './SearchBar';
import LoadingSpinner from './LoadingSpinner';

interface SearchResult {
  id: string;
  type: 'product' | 'campaign' | 'user' | 'group';
  title: string;
  description?: string;
  url: string;
}

export default function GlobalSearch() {
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      submit({ q: debouncedQuery }, { method: 'get', replace: true });
    }
  }, [debouncedQuery, submit]);

  return (
    <div className="relative">
      <Form method="get" className="w-full">
        <SearchBar
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search everything..."
          className="w-full"
        />
      </Form>

      <AnimatePresence>
        {query && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
          >
            <div className="max-h-96 overflow-y-auto">
              {/* Results will be populated by the loader */}
              <div role="status" className="p-4 text-center">
                <LoadingSpinner />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
