import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Text to display below the spinner
   */
  text?: string;
  
  /**
   * Size of the spinner in pixels
   * @default 24
   */
  size?: number;
  
  /**
   * Center the spinner in its container
   * @default false
   */
  center?: boolean;
  
  /**
   * Full page loading state that centers in the viewport
   * @default false
   */
  fullPage?: boolean;
  
  /**
   * Custom spinner component
   */
  spinner?: React.ReactNode;
}

/**
 * Loading component that displays a spinner and optional text
 */
export function Loading({
  text,
  size = 24,
  center = false,
  fullPage = false,
  spinner,
  className,
  ...props
}: LoadingProps) {
  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        center && "w-full h-full",
        fullPage && "fixed inset-0 bg-background/80 backdrop-blur-sm z-50",
        className
      )}
      {...props}
    >
      {spinner || (
        <Loader2
          className="animate-spin text-primary"
          style={{ width: size, height: size }}
        />
      )}
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );

  if (fullPage) {
    return <div className="fixed inset-0 z-50 flex items-center justify-center">{content}</div>;
  }

  return content;
}

/**
 * Skeleton loading component for content placeholders
 */
export function SkeletonLoader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}
