import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  loadingClassName?: string;
}

/**
 * OptimizedImage component with lazy loading, blur-up effect, and error handling
 * Use this component instead of standard <img> tags for better performance
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallbackSrc = '/images/placeholder.svg',
  className = '',
  loadingClassName = '',
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');

  useEffect(() => {
    // Reset states when src changes
    setIsLoading(true);
    setError(false);
    
    // Create new image object to preload
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setError(true);
      setIsLoading(false);
      setCurrentSrc(fallbackSrc);
    };
    
    // Clean up
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackSrc]);

  return (
    <img
      src={currentSrc || fallbackSrc}
      alt={alt}
      loading="lazy"
      className={cn(
        className,
        isLoading && cn('animate-pulse bg-gray-200 dark:bg-gray-700', loadingClassName)
      )}
      onError={() => {
        setError(true);
        setCurrentSrc(fallbackSrc);
      }}
      {...props}
    />
  );
};

export default OptimizedImage;
