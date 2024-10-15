import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './common/Button';

interface SearchBarProps {
  onSearch?: (searchQuery: string) => Promise<void>;
  initialQuery?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        navigate(`/search?query=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center space-x-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-200"
      />
      <Button variant="secondary">
        Search
      </Button>
    </form>
  );
};
export default SearchBar;
