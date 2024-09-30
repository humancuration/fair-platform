import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import InfiniteScrollComponent from '../components/InfiniteScrollComponent';
import api from '../utils/api';
import { handleError } from '../utils/errorHandler';

const SearchResultsPage: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';

  const fetchMoreData = async () => {
    try {
      const response = await api.get(`/search?q=${query}&page=${page}`);
      const newResults = response.data.items;
      setResults(prevResults => [...prevResults, ...newResults]);
      setHasMore(response.data.hasMore);
      setPage(prevPage => prevPage + 1);
      return newResults;
    } catch (error) {
      handleError(error);
      return [];
    }
  };

  useEffect(() => {
    setResults([]);
    setPage(1);
    setHasMore(true);
    fetchMoreData();
  }, [query]);

  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <SearchBar initialQuery={query} />
        <h2 className="text-xl font-semibold mb-4">Search Results for "{query}"</h2>
        <InfiniteScrollComponent
          fetchMoreData={fetchMoreData}
          hasMore={hasMore}
          renderItem={(item) => <ProductCard key={item.id} product={item} />}
          initialData={results}
        />
      </main>
      <Footer />
    </div>
  );
};

export default SearchResultsPage;