import React from "react";
import { ErrorMessage } from "@/components/ui/error-message";
import { useAuth } from "@/hooks/useAuth";

interface AuthErrorHandlerProps {
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
 * Component to handle and display authentication errors
 */
export function AuthErrorHandler({
  message,
  fullPage = false,
  retryText = "Try Again",
  title = "Authentication Error",
}: AuthErrorHandlerProps) {
  const { error, resetError } = useAuth();
  
  if (!error) return null;
  
  return (
    <ErrorMessage
      title={title}
      message={message || error.message}
      onRetry={resetError}
      retryText={retryText}
      fullPage={fullPage}
    />
  );
}

export default AuthErrorHandler;
