import type { FC } from 'react';
import { Form } from '@remix-run/react';
import { motion } from 'framer-motion';
import { FaFilter } from 'react-icons/fa';
import { RangeSlider } from '~/components/shared/RangeSlider';

interface FilterSidebarProps {
  categories: string[];
  currentCategory?: string;
  currentSort?: string;
  priceRange: { min: number; max: number };
  onPriceRangeChange: (range: { min: number; max: number }) => void;
}

export const FilterSidebar: FC<FilterSidebarProps> = ({
  categories,
  currentCategory,
  currentSort,
  priceRange,
  onPriceRangeChange,
}) => {
  return (
    <Form method="get" className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2">
              <input
                type="radio"
                name="category"
                value={category}
                defaultChecked={category === currentCategory}
                className="rounded border-gray-300"
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Price Range</h3>
        <RangeSlider
          min={0}
          max={1000}
          value={priceRange}
          onChange={onPriceRangeChange}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Sort By</h3>
        <select
          name="sort"
          defaultValue={currentSort}
          className="w-full p-2 border rounded"
        >
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest First</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="inStock"
            className="rounded border-gray-300"
          />
          <span>In Stock Only</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="onSale"
            className="rounded border-gray-300"
          />
          <span>On Sale</span>
        </label>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center justify-center gap-2"
      >
        <FaFilter />
        Apply Filters
      </button>
    </Form>
  );
};
