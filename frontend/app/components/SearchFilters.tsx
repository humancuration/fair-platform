import { Form } from '@remix-run/react';
import { motion } from 'framer-motion';

interface SearchFiltersProps {
  defaultValues?: {
    minPrice?: number;
    maxPrice?: number;
    category?: string;
    sortBy?: string;
  };
}

export default function SearchFilters({ defaultValues }: SearchFiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price Range</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="minPrice"
              placeholder="Min"
              defaultValue={defaultValues?.minPrice}
              className="w-full p-2 border rounded"
            />
            <span>-</span>
            <input
              type="number"
              name="maxPrice"
              placeholder="Max"
              defaultValue={defaultValues?.maxPrice}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="category"
            defaultValue={defaultValues?.category}
            className="w-full p-2 border rounded"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="home">Home & Garden</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sort By</label>
          <select
            name="sortBy"
            defaultValue={defaultValues?.sortBy}
            className="w-full p-2 border rounded"
          >
            <option value="relevance">Relevance</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        <div className="flex items-end">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Apply Filters
          </motion.button>
        </div>
      </div>
    </div>
  );
}
