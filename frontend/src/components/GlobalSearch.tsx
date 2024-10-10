import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

interface SearchResult {
  surveys: any[];
  // Add other result types here
}

const GlobalSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      searchAPI(debouncedSearchTerm)
        .then((results) => {
          setIsSearching(false);
          setResults(results);
        })
        .catch((error) => {
          setIsSearching(false);
          toast.error('An error occurred while searching. Please try again.');
          console.error('Search error:', error);
        });
    } else {
      setResults(null);
    }
  }, [debouncedSearchTerm]);

  const searchAPI = async (term: string): Promise<SearchResult> => {
    const response = await axios.get(`/api/search?q=${term}`);
    // Track search event
    await axios.post('/api/analytics/track', {
      eventType: 'search',
      eventData: { term, resultCount: response.data.surveys.length }
    });
    return response.data;
  };

  return (
    <div className="global-search">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search across Fair Platform..."
        className="search-input"
      />
      {isSearching && <div className="searching-indicator">Searching...</div>}
      {results && (
        <div className="search-results">
          {results.surveys.length > 0 ? (
            <div className="result-category">
              <h3>Surveys</h3>
              {results.surveys.map((survey, index) => (
                <Link key={index} to={`/surveys/${survey._id}`} className="result-item">
                  {survey.title}
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-results">No results found</div>
          )}
          {/* Add similar sections for other content types */}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;