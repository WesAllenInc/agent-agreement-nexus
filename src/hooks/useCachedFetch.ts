import { useState, useEffect, useRef, useCallback } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

interface UseCachedFetchOptions {
  /** Cache expiration time in milliseconds (default: 5 minutes) */
  cacheTime?: number;
  /** Whether to automatically fetch on mount (default: true) */
  autoFetch?: boolean;
  /** Whether to use cache-first strategy (default: true) */
  cacheFirst?: boolean;
  /** Debounce time in milliseconds (default: 300ms) */
  debounceTime?: number;
}

// Global cache storage
const cache: Record<string, CacheItem<any>> = {};

/**
 * Custom hook for data fetching with caching and debouncing
 * @param url The URL to fetch data from
 * @param options Configuration options
 * @returns Fetch state and refetch function
 */
export function useCachedFetch<T>(
  url: string,
  options: UseCachedFetchOptions = {}
): [FetchState<T>, (forceRefresh?: boolean) => Promise<T | null>] {
  const {
    cacheTime = 5 * 60 * 1000, // 5 minutes default
    autoFetch = true,
    cacheFirst = true,
    debounceTime = 300,
  } = options;

  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: autoFetch,
    error: null,
  });

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Check if cache is valid
  const isCacheValid = useCallback((cacheKey: string): boolean => {
    const item = cache[cacheKey];
    if (!item) return false;
    
    const now = Date.now();
    return now - item.timestamp < cacheTime;
  }, [cacheTime]);

  // Fetch data with debouncing
  const fetchData = useCallback(async (forceRefresh = false): Promise<T | null> => {
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    return new Promise<T | null>((resolve) => {
      debounceTimerRef.current = setTimeout(async () => {
        if (!isMountedRef.current) {
          resolve(null);
          return;
        }

        // Check cache first if not forcing refresh
        if (!forceRefresh && cacheFirst && isCacheValid(url)) {
          const cachedData = cache[url].data;
          setState({
            data: cachedData,
            isLoading: false,
            error: null,
          });
          resolve(cachedData);
          return;
        }

        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
          const response = await fetch(url);
          
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (!isMountedRef.current) {
            resolve(null);
            return;
          }
          
          // Update cache
          cache[url] = {
            data,
            timestamp: Date.now(),
          };
          
          setState({
            data,
            isLoading: false,
            error: null,
          });
          
          resolve(data);
        } catch (error) {
          if (!isMountedRef.current) {
            resolve(null);
            return;
          }
          
          setState({
            data: null,
            isLoading: false,
            error: error instanceof Error ? error : new Error(String(error)),
          });
          
          resolve(null);
        }
      }, debounceTime);
    });
  }, [url, cacheFirst, debounceTime, isCacheValid]);

  // Initial fetch on mount
  useEffect(() => {
    isMountedRef.current = true;
    
    if (autoFetch) {
      fetchData(false);
    }
    
    return () => {
      isMountedRef.current = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [fetchData, autoFetch]);

  return [state, fetchData];
}

/**
 * Clear all cached data or specific URL
 * @param url Optional URL to clear specific cache entry
 */
export function clearCache(url?: string): void {
  if (url) {
    delete cache[url];
  } else {
    Object.keys(cache).forEach(key => {
      delete cache[key];
    });
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number, keys: string[] } {
  return {
    size: Object.keys(cache).length,
    keys: Object.keys(cache),
  };
}

export default useCachedFetch;
