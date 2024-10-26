import { useRef, type ChangeEvent } from 'react';
import { Form } from '@remix-run/react';
import { motion } from 'framer-motion';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface SearchBarProps {
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export default function SearchBar({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search...',
  className = '',
  autoFocus = false
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Form 
      method="get" 
      className={`
        relative flex items-center 
        bg-white dark:bg-gray-800 
        rounded-lg shadow-sm
        ${className}
      `}
    >
      <div className="absolute left-3 text-gray-400">
        <FaSearch />
      </div>

      <input
        ref={inputRef}
        type="search"
        name="q"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="
          w-full py-2 pl-10 pr-8
          bg-transparent
          border border-gray-300 dark:border-gray-600
          rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500
          dark:text-white
          placeholder-gray-400
        "
      />

      {value && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={handleClear}
          className="
            absolute right-3
            text-gray-400 hover:text-gray-600
            dark:hover:text-gray-300
            focus:outline-none
          "
          aria-label="Clear search"
        >
          <FaTimes />
        </motion.button>
      )}
    </Form>
  );
}
