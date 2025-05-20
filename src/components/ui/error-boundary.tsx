import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorMessage } from './error-message';

interface ErrorBoundaryProps {
  /**
   * Child components to render
   */
  children: ReactNode;
  
  /**
   * Custom fallback component to render when an error occurs
   */
  fallback?: ReactNode;
  
  /**
   * Custom error title
   */
  title?: string;
  
  /**
   * Custom error message
   */
  message?: string;
  
  /**
   * Whether to display as a full page error
   */
  fullPage?: boolean;
  
  /**
   * Function to call when an error occurs
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component that catches errors in its child components
 * and displays a fallback UI instead of crashing the whole app
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Call onError if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    const { children, fallback, title, message, fullPage = false } = this.props;
    const { hasError, error } = this.state;

    if (hasError) {
      // If a custom fallback is provided, use it
      if (fallback) {
        return fallback;
      }

      // Otherwise, use the ErrorMessage component
      return (
        <ErrorMessage
          title={title || 'Something went wrong'}
          message={message || (error?.message || 'An unexpected error occurred')}
          onRetry={this.resetError}
          retryText="Try Again"
          fullPage={fullPage}
        />
      );
    }

    return children;
  }
}

export default ErrorBoundary;
