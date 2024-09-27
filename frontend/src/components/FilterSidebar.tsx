import React, { useState } from 'react';

interface FilterSidebarProps {
  onFilterChange: (filters: object) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [categories, setCategories] = useState<string[]>([]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({ ...prev, [name]: parseInt(value) }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setCategories(prev => [...prev, value]);
    } else {
      setCategories(prev => prev.filter(cat => cat !== value));
    }
  };

  const applyFilters = () => {
    onFilterChange({ priceRange, categories });
  };

  return (
    <div className="bg-white p-4 rounded-md shadow">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      <div className="mb-4">
        <h3 className="font-medium mb-2">Price Range</h3>
        <div className="flex items-center">
          <input
            type="number"
            name="min"
            value={priceRange.min}
            onChange={handlePriceChange}
            className="w-20 px-2 py-1 border rounded mr-2"
          />
          <span>to</span>
          <input
            type="number"
            name="max"
            value={priceRange.max}
            onChange={handlePriceChange}
            className="w-20 px-2 py-1 border rounded ml-2"
          />
        </div>
      </div>
      <div className="mb-4">
        <h3 className="font-medium mb-2">Categories</h3>
        {['Electronics', 'Clothing', 'Books', 'Home & Garden'].map(category => (
          <div key={category} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={category}
              value={category}
              onChange={handleCategoryChange}
              className="mr-2"
            />
            <label htmlFor={category}>{category}</label>
          </div>
        ))}
      </div>
      <button
        onClick={applyFilters}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FilterSidebar;