import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { Replay } from '@sentry/replay';
import { Span } from '@sentry/react';

/**
 * Utility functions for error tracking and performance monitoring with Sentry
 */

/**
 * Capture an exception with additional context
 * @param error The error to capture
 * @param context Additional context to include with the error
 * @param tags Optional tags to categorize the error
 */
export const captureException = (
  error: Error | unknown, 
  context?: Record<string, any>,
  tags?: Record<string, string>
) => {
  // If error is not an Error instance, convert it to one
  const normalizedError = error instanceof Error 
    ? error 
    : new Error(error ? String(error) : 'Unknown error');
  
  // Add breadcrumb for better debugging
  Sentry.addBreadcrumb({
    category: 'error',
    message: `Error captured: ${normalizedError.message}`,
    level: 'error',
    data: { 
      name: normalizedError.name,
      stack: normalizedError.stack,
      ...context
    }
  });

  // Capture the exception with additional context
  Sentry.captureException(normalizedError, {
    contexts: context,
    tags: tags,
  });
};

/**
 * Capture a message with additional context
 * @param message The message to capture
 * @param level The severity level of the message
 * @param context Additional context to include with the message
 * @param tags Optional tags to categorize the message
 */
export const captureMessage = (
  message: string, 
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, any>,
  tags?: Record<string, string>
) => {
  // Add breadcrumb for better debugging
  Sentry.addBreadcrumb({
    category: 'message',
    message: `Message captured: ${message}`,
    level,
    data: context
  });

  Sentry.captureMessage(message, {
    level,
    contexts: context,
    tags: tags,
  });
};

/**
 * Set user information for error tracking
 * @param user User information to associate with subsequent events
 */
export const setUser = (user: {
  id?: string;
  email?: string;
  username?: string;
  [key: string]: any;
} | null) => {
  Sentry.setUser(user);
  
  // Add breadcrumb when user context changes
  if (user) {
    Sentry.addBreadcrumb({
      category: 'auth',
      message: 'User context updated',
      level: 'info',
      data: {
        userId: user.id,
        hasEmail: !!user.email,
      }
    });
  } else {
    Sentry.addBreadcrumb({
      category: 'auth',
      message: 'User context cleared',
      level: 'info'
    });
  }
};



/**
 * Wrap a function with Sentry error tracking
 * @param fn The function to wrap
 * @param options Additional options for error tracking
 * @returns The wrapped function
 */
export const withErrorTracking = <T extends any[], R>(
  fn: (...args: T) => R,
  options?: {
    errorMessage?: string;
    category?: string;
    tags?: Record<string, string>;
  }
): ((...args: T) => R) => {
  return (...args: T) => {
    try {
      // Add breadcrumb for function execution
      Sentry.addBreadcrumb({
        category: options?.category || 'function',
        message: `Executing ${fn.name || 'anonymous function'}`,
        level: 'debug',
      });
      
      return fn(...args);
    } catch (error) {
      captureException(error, { 
        args: JSON.stringify(args),
        errorMessage: options?.errorMessage,
        functionName: fn.name || 'anonymous function',
      }, options?.tags);
      
      throw error;
    }
  };
};

/**
 * Monitor a function's performance
 * @param name The name of the operation to monitor
 * @param fn The function to monitor
 * @returns The result of the function
 */
export const monitorPerformance = <T>(name: string, fn: () => T): T => {
  try {
    const startTime = performance.now();
    const result = fn();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Log performance data to Sentry
    Sentry.addBreadcrumb({
      category: 'performance',
      message: `Performance: ${name}`,
      data: {
        duration: `${duration.toFixed(2)}ms`,
      },
      level: 'info'
    });
    
    // For longer operations, capture as a custom measurement
    if (duration > 100) { // Only track operations longer than 100ms
      Sentry.captureMessage(`Performance: ${name} took ${duration.toFixed(2)}ms`, {
        level: duration > 1000 ? 'warning' : 'info',
      });
    }
    
    return result;
  } catch (error) {
    captureException(error, { operation: name });
    throw error;
  }
};

/**
 * Initialize Sentry with optimal configuration
 * @param options Additional configuration options
 */
export interface SentryConfig {
  dsn?: string;
  environment?: string;
  debug?: boolean;
  tracesSampleRate?: number;
  tracePropagationTargets?: (string | RegExp)[];
  integrations?: any[];
  replaysSessionSampleRate?: number;
  replaysOnErrorSampleRate?: number;
  enableTracing?: boolean;
}

export const initializeSentry = (options?: SentryConfig) => {
  Sentry.init({
    dsn: options?.dsn || import.meta.env.VITE_SENTRY_DSN || '',
    environment: options?.environment || import.meta.env.MODE || 'development',
    debug: options?.debug !== undefined ? options?.debug : import.meta.env.MODE === 'development',
    integrations: [
      // Add performance monitoring integrations
      // Note: BrowserTracing is automatically included with @sentry/react
    ],
    tracesSampleRate: options?.tracesSampleRate || 0.1,
    beforeSend(event) {
      // Sanitize sensitive data if needed
      if (event.request && event.request.headers) {
        delete event.request.headers['Authorization'];
        delete event.request.headers['Cookie'];
      }
      
      // Remove sensitive data from URLs
      if (event.request && event.request.url) {
        // Remove tokens, API keys, etc. from query strings
        event.request.url = event.request.url.replace(
          /([?&](token|key|api[_-]?key|password)=)[^&]+/gi,
          '$1[REDACTED]'
        );
      }
      
      return event;
    },
  });
};
