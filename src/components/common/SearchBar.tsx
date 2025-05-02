import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { t } from '../../utils/i18n';

// Custom hook for debouncing
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

type SearchResult = {
  id: string;
  title: string;
  type: 'agreement' | 'document' | 'page' | 'user';
  url: string;
};

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string, results: SearchResult[]) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder,
  onSearch 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  
  const debouncedQuery = useDebounce(query, 300);
  
  useEffect(() => {
    const searchItems = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setResults([]);
        return;
      }
      
      setIsLoading(true);
      
      // API call to search (placeholder for now)
      try {
        // Mock results for UI scaffolding
        const mockResults: SearchResult[] = [
          { id: '1', title: 'Sales Agreement #1234', type: 'agreement', url: '/agent/agreement?id=1234' },
          { id: '2', title: 'Agent Profile', type: 'page', url: '/agent/profile' },
          { id: '3', title: 'John Doe', type: 'user', url: '/users/john-doe' },
        ];
        
        setResults(mockResults.filter(item => 
          item.title.toLowerCase().includes(debouncedQuery.toLowerCase())
        ));
        
        if (onSearch) {
          onSearch(debouncedQuery, mockResults);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    searchItems();
  }, [debouncedQuery, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      navigate(results[selectedIndex].url);
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-md" onKeyDown={handleKeyDown}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder={placeholder || t('search.placeholder')}
          className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 dark:bg-gray-800 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 dark:focus:bg-gray-700 transition-colors"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.length > 0);
          }}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          aria-label={t('search.placeholder')}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
          </div>
        )}
      </div>
      
      {isOpen && results.length > 0 && (
        <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg max-h-60 overflow-auto z-50">
          <ul className="py-1" role="listbox">
            {results.map((result, index) => (
              <li 
                key={result.id}
                className={`px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                  index === selectedIndex ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
                onClick={() => {
                  navigate(result.url);
                  setIsOpen(false);
                }}
                role="option"
                aria-selected={index === selectedIndex}
              >
                <div className="flex items-center">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-600 mr-2">
                    {result.type}
                  </span>
                  <span>{result.title}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
