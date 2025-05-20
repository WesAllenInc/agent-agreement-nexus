import { toast } from 'sonner';

/**
 * Standard error types for the application
 */
export enum ErrorType {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  NETWORK = 'network',
  UNKNOWN = 'unknown',
}

/**
 * Application error with additional context
 */
export class AppError extends Error {
  type: ErrorType;
  originalError?: unknown;
  context?: Record<string, any>;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    originalError?: unknown,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.originalError = originalError;
    this.context = context;
  }
}

/**
 * Get a user-friendly error message from any error
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    // Handle specific error types
    if (error.message.includes('not authenticated')) {
      return 'You need to sign in to access this feature.';
    }
    
    if (error.message.includes('permission denied')) {
      return 'You do not have permission to perform this action.';
    }
    
    if (error.message.includes('network')) {
      return 'Network error. Please check your internet connection and try again.';
    }
    
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again later.';
}

/**
 * Determine the error type from any error
 */
export function getErrorType(error: unknown): ErrorType {
  if (error instanceof AppError) {
    return error.type;
  }
  
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('not authenticated') || message.includes('login') || message.includes('sign in')) {
      return ErrorType.AUTHENTICATION;
    }
    
    if (message.includes('permission denied') || message.includes('not authorized') || message.includes('forbidden')) {
      return ErrorType.AUTHORIZATION;
    }
    
    if (message.includes('validation') || message.includes('invalid')) {
      return ErrorType.VALIDATION;
    }
    
    if (message.includes('not found') || message.includes('404')) {
      return ErrorType.NOT_FOUND;
    }
    
    if (message.includes('server') || message.includes('500')) {
      return ErrorType.SERVER;
    }
    
    if (message.includes('network') || message.includes('connection')) {
      return ErrorType.NETWORK;
    }
  }
  
  return ErrorType.UNKNOWN;
}

/**
 * Handle an error with standardized logging and notification
 */
export function handleError(
  error: unknown,
  {
    showToast = true,
    logToConsole = true,
    context = {},
  }: {
    showToast?: boolean;
    logToConsole?: boolean;
    context?: Record<string, any>;
  } = {}
): AppError {
  // Convert to AppError
  const appError = error instanceof AppError
    ? error
    : new AppError(
        getUserFriendlyErrorMessage(error),
        getErrorType(error),
        error,
        context
      );
  
  // Log to console
  if (logToConsole) {
    console.error('[App Error]', {
      message: appError.message,
      type: appError.type,
      originalError: appError.originalError,
      context: appError.context,
    });
  }
  
  // Show toast notification
  if (showToast) {
    toast.error(appError.message);
  }
  
  return appError;
}

/**
 * Try to execute a function and handle any errors
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  options: {
    errorMessage?: string;
    showToast?: boolean;
    logToConsole?: boolean;
    context?: Record<string, any>;
  } = {}
): Promise<[T | null, AppError | null]> {
  try {
    const result = await fn();
    return [result, null];
  } catch (error) {
    const appError = handleError(
      options.errorMessage ? new Error(options.errorMessage) : error,
      {
        showToast: options.showToast,
        logToConsole: options.logToConsole,
        context: options.context,
      }
    );
    return [null, appError];
  }
}

export default {
  AppError,
  ErrorType,
  getUserFriendlyErrorMessage,
  getErrorType,
  handleError,
  tryCatch,
};
