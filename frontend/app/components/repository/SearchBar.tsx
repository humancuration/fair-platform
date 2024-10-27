import type { FC } from 'react';
import { Form } from '@remix-run/react';
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
  defaultValue: string;
  onSearch: (term: string) => void;
}

export const SearchBar: FC<SearchBarProps> = ({ defaultValue, onSearch }) => {
  return (
    <Form 
      className="mb-6"
      onChange={(e) => {
        const formData = new FormData(e.currentTarget);
        onSearch(formData.get("search") as string);
      }}
    >
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          name="search"
          defaultValue={defaultValue}
          placeholder="Search repositories..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Search repositories"
        />
      </div>
    </Form>
  );
};
