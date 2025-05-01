import React from 'react';
import { cn } from '../../../lib/utils';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
  isLoading?: boolean;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  children,
  className,
  footer,
  isLoading = false,
}) => {
  return (
    <div className={cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      className
    )}>
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          {title}
        </h3>
        <div className={cn(
          'mt-4',
          isLoading && 'animate-pulse'
        )}>
          {children}
        </div>
      </div>
      {footer && (
        <div className="border-t bg-muted/50 p-4">
          {footer}
        </div>
      )}
    </div>
  );
};
