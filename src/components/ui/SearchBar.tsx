'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  autoFocus?: boolean;
}

export default function SearchBar({ placeholder = 'Search products...', onSearch, className = '', autoFocus = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus();
  }, [autoFocus]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
    if (onSearch) onSearch('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative group ${className}`}
      role="search"
    >
      <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focused ? 'text-gold-500' : 'text-neutral-400'}`} />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-2.5 bg-white border-2 border-neutral-200 rounded-md text-sm text-neutral-900 placeholder:text-neutral-400 placeholder:italic focus:outline-none focus:border-gold-500 focus:ring-[3px] focus:ring-gold-500/15 transition-all duration-200"
        aria-label={placeholder}
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );
}
