import * as Sentry from '@sentry/react';

/**
 * Utility functions for error tracking with Sentry
 */

/**
 * Capture an exception with additional context
 * @param error The error to capture
 * @param context Additional context to include with the error
 */
export const captureException = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, {
    contexts: context,
  });
};

/**
 * Capture a message with additional context
 * @param message The message to capture
 * @param level The severity level of the message
 * @param context Additional context to include with the message
 */
export const captureMessage = (
  message: string, 
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, any>
) => {
  Sentry.captureMessage(message, {
    level,
    contexts: context,
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
};



/**
 * Wrap a function with Sentry error tracking
 * @param fn The function to wrap
 * @param errorMessage Optional custom error message
 * @returns The wrapped function
 */
export const withErrorTracking = <T extends any[], R>(
  fn: (...args: T) => R,
  errorMessage?: string
): ((...args: T) => R) => {
  return (...args: T) => {
    try {
      return fn(...args);
    } catch (error) {
      if (error instanceof Error) {
        captureException(error, { 
          args: JSON.stringify(args),
          errorMessage 
        });
      }
      throw error;
    }
  };
};
