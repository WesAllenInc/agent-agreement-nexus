import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ErrorMessage } from '@/components/ui/error-message';

interface ErrorContextType {
  /**
   * Current global error
   */
  error: Error | null;
  
  /**
   * Set a global error
   */
  setError: (error: Error | null) => void;
  
  /**
   * Clear the current error
   */
  clearError: () => void;
  
  /**
   * Capture an error from a try/catch block
   */
  captureError: (error: unknown) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
}

/**
 * Provider component for the global error context
 */
export function ErrorProvider({ children }: ErrorProviderProps) {
  const [error, setError] = useState<Error | null>(null);

  const clearError = () => setError(null);

  const captureError = (err: unknown) => {
    console.error('Global error captured:', err);
    if (err instanceof Error) {
      setError(err);
    } else {
      setError(new Error(String(err)));
    }
  };

  // Create the context value
  const contextValue: ErrorContextType = {
    error,
    setError,
    clearError,
    captureError,
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {error ? (
        <ErrorMessage
          title="Application Error"
          error={error}
          onRetry={clearError}
          fullPage
        />
      ) : (
        children
      )}
    </ErrorContext.Provider>
  );
}

/**
 * Hook to access the global error context
 */
export function useError(): ErrorContextType {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
}

export default ErrorContext;
