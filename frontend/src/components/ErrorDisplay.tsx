import React from 'react';
import { useError } from '../contexts/ErrorContext';

const ErrorDisplay: React.FC = () => {
  const { error, setError } = useError();

  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
      <span>{error}</span>
      <button
        onClick={() => setError(null)}
        className="ml-4 text-lg font-bold"
      >
        &times;
      </button>
    </div>
  );
};

export default ErrorDisplay;