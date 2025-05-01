import React, { useState, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import { cn } from '../../../lib/utils';

interface SearchWithAutocompleteProps<T> {
  onSearch: (query: string) => Promise<T[]>;
  onSelect: (item: T) => void;
  renderItem: (item: T) => React.ReactNode;
  placeholder?: string;
  label?: string;
  className?: string;
  inputClassName?: string;
  listboxClassName?: string;
  isLoading?: boolean;
}

export function SearchWithAutocomplete<T>({
  onSearch,
  onSelect,
  renderItem,
  placeholder = 'Search...',
  label,
  className,
  inputClassName,
  listboxClassName,
  isLoading = false,
}: SearchWithAutocompleteProps<T>) {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [items, setItems] = useState<T[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!debouncedQuery) {
      setItems([]);
      return;
    }
    try {
      const results = await onSearch(debouncedQuery);
      setItems(results);
      setIsOpen(true);
    } catch (error) {
      console.error('Search error:', error);
      setItems([]);
    }
  }, [debouncedQuery, onSearch]);

  React.useEffect(() => {
    handleSearch();
  }, [debouncedQuery, handleSearch]);

  return (
    <div className={cn('relative w-full', className)}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring',
            inputClassName
          )}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="search-listbox"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>
      {isOpen && items.length > 0 && (
        <ul
          id="search-listbox"
          role="listbox"
          className={cn(
            'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md',
            listboxClassName
          )}
        >
          {items.map((item, index) => (
            <li
              key={index}
              role="option"
              onClick={() => {
                onSelect(item);
                setQuery('');
                setIsOpen(false);
              }}
              className="cursor-pointer rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
            >
              {renderItem(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
