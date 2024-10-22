import React, { useState, useEffect, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import SearchBar from './SearchBar';
import LoadingSpinner from './LoadingSpinner';
import { useQuery, useMutation } from 'react-query';

interface SearchResult {
  surveys: any[];
  // Add other result types here
}

const SearchResults: React.FC<{ results: SearchResult | null }> = ({ results }) => {
  if (!results) return null;

  return (
    <div className="search-results">
      {results.surveys.length > 0 ? (
        <div className="result-category">
          <h3>Surveys</h3>
          {results.surveys.map((survey) => (
            <Link key={survey._id} to={`/surveys/${survey._id}`} className="result-item">
              {survey.title}
            </Link>
          ))}
        </div>
      ) : (
        <div className="no-results">No results found</div>
      )}
      {/* Add similar sections for other content types */}
    </div>
  );
};

const GlobalSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const { data: results, isLoading } = useQuery<SearchResult>(
    ['search', debouncedSearchTerm],
    () => axios.get(`/api/search?q=${debouncedSearchTerm}`).then(res => res.data),
    { enabled: !!debouncedSearchTerm }
  );

  const trackSearchMutation = useMutation(
    (eventData: { term: string; resultCount: number }) =>
      axios.post('/api/analytics/track', { eventType: 'search', eventData })
  );

  useEffect(() => {
    if (results) {
      trackSearchMutation.mutate({
        term: debouncedSearchTerm,
        resultCount: results.surveys.length
      });
    }
  }, [results, debouncedSearchTerm]);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  return (
    <div className="global-search">
      <SearchBar onSearch={handleSearch} initialQuery={searchTerm} />
      {isLoading && <LoadingSpinner />}
      <SearchResults results={results || null} />
    </div>
  );
};

export default GlobalSearch;
