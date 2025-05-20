import { useState, useCallback, useEffect } from 'react';

interface UseAsyncOptions<T> {
  /**
   * Initial data value
   */
  initialData?: T;
  
  /**
   * Whether to run the async function immediately on mount
   * @default false
   */
  immediate?: boolean;
  
  /**
   * Dependencies array for immediate execution
   */
  deps?: React.DependencyList;
  
  /**
   * Callback to run on success
   */
  onSuccess?: (data: T) => void;
  
  /**
   * Callback to run on error
   */
  onError?: (error: Error) => void;
}

/**
 * Hook to handle async operations with loading and error states
 */
export function useAsync<T = any>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions<T> = {}
) {
  const {
    initialData,
    immediate = false,
    deps = [],
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<Error | null>(null);

  // Function to execute the async operation
  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [asyncFunction, onSuccess, onError]);

  // Execute immediately if specified
  useEffect(() => {
    if (immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, immediate]);

  // Reset the state
  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setLoading(false);
  }, [initialData]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    setData,
  };
}

export default useAsync;
