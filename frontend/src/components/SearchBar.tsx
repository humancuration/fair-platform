import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './common/Button';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
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
      <Button type="submit" variant="secondary">
        Search
      </Button>
    </form>
  );
};

export default SearchBar;