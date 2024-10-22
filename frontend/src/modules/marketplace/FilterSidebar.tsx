import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFilter, FaTimes } from 'react-icons/fa';
import RangeSlider from '../components/common/RangeSlider';

interface FilterSidebarProps {
  onFilterChange: (filters: FilterOptions) => void;
  categories: string[];
  tags: string[];
}

interface FilterOptions {
  priceRange: { min: number; max: number };
  categories: string[];
  tags: string[];
  sortBy: string;
  inStock: boolean;
  onSale: boolean;
}

export default function FilterSidebar({ onFilterChange, categories, tags }: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: { min: 0, max: 1000 },
    categories: [],
    tags: [],
    sortBy: 'popular',
    inStock: false,
    onSale: false
  });

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <>
      <button
        className="md:hidden fixed bottom-4 right-4 bg-primary-500 p-4 rounded-full shadow-lg z-50"
        onClick={() => setIsOpen(true)}
      >
        <FaFilter className="text-white" />
      </button>

      <motion.div
        className={`fixed md:relative top-0 left-0 h-full bg-white dark:bg-gray-800 p-6 shadow-xl overflow-y-auto z-50
          ${isOpen ? 'block' : 'hidden md:block'}`}
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Filters</h2>
          <button
            className="md:hidden text-gray-500"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        <div className="space-y-6">
          {/* Price Range */}
          <div>
            <h3 className="font-medium mb-4">Price Range</h3>
            <RangeSlider
              min={0}
              max={1000}
              value={filters.priceRange}
              onChange={(value) => handleFilterChange('priceRange', value)}
            />
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-medium mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={(e) => {
                      const newCategories = e.target.checked
                        ? [...filters.categories, category]
                        : filters.categories.filter((c) => c !== category);
                      handleFilterChange('categories', newCategories);
                    }}
                    className="mr-2"
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="font-medium mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.tags.includes(tag)
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => {
                    const newTags = filters.tags.includes(tag)
                      ? filters.tags.filter((t) => t !== tag)
                      : [...filters.tags, tag];
                    handleFilterChange('tags', newTags);
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <h3 className="font-medium mb-4">Sort By</h3>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Additional Filters */}
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                className="mr-2"
              />
              In Stock Only
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.onSale}
                onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                className="mr-2"
              />
              On Sale
            </label>
          </div>
        </div>
      </motion.div>
    </>
  );
}
