import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Alert, AlertDescription, AlertTitle } from "./alert";

export interface ErrorMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Error title
   * @default "An error occurred"
   */
  title?: string;
  
  /**
   * Error message to display
   */
  message?: string;
  
  /**
   * Error object
   */
  error?: Error | unknown;
  
  /**
   * Function to retry the operation
   */
  onRetry?: () => void;
  
  /**
   * Text for the retry button
   * @default "Try Again"
   */
  retryText?: string;
  
  /**
   * Whether to show the retry button
   * @default true if onRetry is provided
   */
  showRetry?: boolean;
  
  /**
   * Whether to show a full page error
   * @default false
   */
  fullPage?: boolean;
  
  /**
   * Custom action element to display below the error message
   */
  action?: React.ReactNode;
}

/**
 * Error message component that displays an error with optional retry button
 */
export function ErrorMessage({
  title = "An error occurred",
  message,
  error,
  onRetry,
  retryText = "Try Again",
  showRetry = !!onRetry,
  fullPage = false,
  className,
  action,
  ...props
}: ErrorMessageProps) {
  // Format error message
  const errorMessage = message || (error instanceof Error ? error.message : String(error || ""));
  
  const content = (
    <div
      className={cn(
        "flex flex-col gap-4",
        fullPage && "items-center text-center max-w-md mx-auto",
        className
      )}
      {...props}
    >
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        {errorMessage && <AlertDescription>{errorMessage}</AlertDescription>}
      </Alert>
      
      {showRetry && onRetry && (
        <Button 
          variant="outline" 
          onClick={onRetry}
          className={cn(fullPage && "w-full max-w-xs")}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {retryText}
        </Button>
      )}
      
      {action && <div className={cn("mt-4", fullPage && "w-full max-w-xs")}>{action}</div>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        {content}
      </div>
    );
  }

  return content;
}

/**
 * Empty state component for when there's no data to display
 */
export function EmptyState({
  title = "No data found",
  message = "There are no items to display at this time.",
  icon,
  action,
  className,
  ...props
}: {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-lg border border-dashed",
        className
      )}
      {...props}
    >
      {icon}
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-xs">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
