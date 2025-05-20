import React from "react";
import { ErrorMessage } from "@/components/ui/error-message";

interface AgreementErrorHandlerProps {
  /**
   * Error object to display
   */
  error: Error | null;
  
  /**
   * Function to retry the operation
   */
  onRetry?: () => void;
  
  /**
   * Custom error message to display
   */
  message?: string;
  
  /**
   * Whether to show the error as a full page
   * @default false
   */
  fullPage?: boolean;
  
  /**
   * Custom retry text
   */
  retryText?: string;
  
  /**
   * Custom error title
   */
  title?: string;
}

/**
 * Component to handle and display agreement-related errors
 */
export function AgreementErrorHandler({
  error,
  onRetry,
  message,
  fullPage = false,
  retryText = "Try Again",
  title = "Error Loading Agreements",
}: AgreementErrorHandlerProps) {
  if (!error) return null;
  
  return (
    <ErrorMessage
      title={title}
      message={message || error.message}
      onRetry={onRetry}
      retryText={retryText}
      fullPage={fullPage}
    />
  );
}

export default AgreementErrorHandler;
