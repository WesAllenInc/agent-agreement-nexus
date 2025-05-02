/**
 * Performance utility functions for measuring and optimizing component rendering
 */

import { useRef, useEffect } from 'react';

/**
 * Measures component render time
 * @param componentName Name of the component to measure
 * @param threshold Warning threshold in milliseconds
 */
export function useRenderTimer(componentName: string, threshold = 16) {
  const renderCount = useRef(0);
  
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      renderCount.current += 1;
      
      // Only log if render time exceeds threshold (1 frame at 60fps)
      if (renderTime > threshold) {
        console.warn(
          `[Performance] ${componentName} rendered in ${renderTime.toFixed(2)}ms ` +
          `(render count: ${renderCount.current})`
        );
      }
    };
  });
}

/**
 * Debounces a function call
 * @param fn Function to debounce
 * @param delay Delay in milliseconds
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Throttles a function call
 * @param fn Function to throttle
 * @param limit Limit in milliseconds
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    const now = Date.now();
    
    if (now - lastCall < limit) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        lastCall = now;
        fn(...args);
        timeoutId = null;
      }, limit - (now - lastCall));
      
      return;
    }
    
    lastCall = now;
    fn(...args);
  };
}

/**
 * Memoizes a function (caches results)
 * @param fn Function to memoize
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();
  
  return function(...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    return result;
  };
}

/**
 * Measures execution time of a function
 * @param fn Function to measure
 * @param name Name for logging
 */
export function measureExecutionTime<T extends (...args: any[]) => any>(
  fn: T,
  name: string
): (...args: Parameters<T>) => ReturnType<T> {
  return function(...args: Parameters<T>): ReturnType<T> {
    const startTime = performance.now();
    const result = fn(...args);
    const endTime = performance.now();
    
    console.log(`[Performance] ${name} executed in ${(endTime - startTime).toFixed(2)}ms`);
    
    return result;
  };
}
