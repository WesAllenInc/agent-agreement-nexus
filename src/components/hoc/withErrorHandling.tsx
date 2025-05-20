import React from 'react';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';

interface WithErrorHandlingProps {
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  loadingText?: string;
  errorTitle?: string;
  fullPage?: boolean;
}

/**
 * Higher-order component that adds error handling and loading states to any component
 * 
 * @param WrappedComponent The component to wrap
 * @param defaultOptions Default options for the HOC
 */
export function withErrorHandling<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  defaultOptions: Omit<WithErrorHandlingProps, 'loading' | 'error' | 'onRetry'> = {}
) {
  const WithErrorHandling = (props: P & WithErrorHandlingProps) => {
    const {
      loading,
      error,
      onRetry,
      loadingText = defaultOptions.loadingText || 'Loading...',
      errorTitle = defaultOptions.errorTitle || 'An error occurred',
      fullPage = defaultOptions.fullPage || false,
      ...componentProps
    } = props;

    if (loading) {
      return <Loading text={loadingText} fullPage={fullPage} />;
    }

    if (error) {
      return (
        <ErrorMessage
          title={errorTitle}
          error={error}
          onRetry={onRetry}
          fullPage={fullPage}
        />
      );
    }

    return <WrappedComponent {...(componentProps as P)} />;
  };

  // Set display name for debugging
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithErrorHandling.displayName = `withErrorHandling(${displayName})`;

  return WithErrorHandling;
}

export default withErrorHandling;
