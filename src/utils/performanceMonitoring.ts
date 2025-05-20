import * as Sentry from '@sentry/react';

/**
 * Performance monitoring utility for tracking key performance metrics
 * and reporting them to Sentry for analysis.
 */

// Interface for custom performance metrics
interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'percent' | 'count';
  tags?: Record<string, string>;
}

/**
 * Track a custom performance metric
 * @param metric Performance metric to track
 */
export const trackMetric = (metric: PerformanceMetric) => {
  Sentry.addBreadcrumb({
    category: 'performance',
    message: `${metric.name}: ${metric.value}${metric.unit}`,
    level: 'info',
    data: {
      ...metric,
      ...metric.tags
    }
  });
  
  // If in development, log to console for easier debugging
  if (import.meta.env.DEV) {
    console.log(`[Performance] ${metric.name}: ${metric.value}${metric.unit}`, metric.tags);
  }
};

/**
 * Measure the time it takes to execute a function
 * @param fn Function to measure
 * @param name Name of the operation
 * @param tags Optional tags to associate with the measurement
 * @returns The result of the function
 */
export const measureExecutionTime = async <T>(
  fn: () => Promise<T> | T,
  name: string,
  tags?: Record<string, string>
): Promise<T> => {
  const startTime = performance.now();
  
  try {
    const result = await fn();
    const endTime = performance.now();
    
    trackMetric({
      name: `${name}_duration`,
      value: Math.round(endTime - startTime),
      unit: 'ms',
      tags
    });
    
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Track web vitals metrics
 * Should be called once when the app initializes
 */
export const setupWebVitalsTracking = () => {
  // Load web-vitals dynamically - using dynamic import and type assertion to avoid TypeScript errors
  import('web-vitals').then((webVitals: any) => {
    // Use the web-vitals API to track core web vitals
    if (typeof webVitals.onCLS === 'function') {
      webVitals.onCLS((metric: any) => {
        trackMetric({
          name: 'Cumulative Layout Shift',
          value: metric.value,
          unit: 'count',
          tags: { id: metric.id }
        });
      });
    }
    
    if (typeof webVitals.onFID === 'function') {
      webVitals.onFID((metric: any) => {
        trackMetric({
          name: 'First Input Delay',
          value: metric.value,
          unit: 'ms',
          tags: { id: metric.id }
        });
      });
    }
    
    if (typeof webVitals.onLCP === 'function') {
      webVitals.onLCP((metric: any) => {
        trackMetric({
          name: 'Largest Contentful Paint',
          value: metric.value,
          unit: 'ms',
          tags: { id: metric.id }
        });
      });
    }
    
    if (typeof webVitals.onFCP === 'function') {
      webVitals.onFCP((metric: any) => {
        trackMetric({
          name: 'First Contentful Paint',
          value: metric.value,
          unit: 'ms',
          tags: { id: metric.id }
        });
      });
    }
    
    if (typeof webVitals.onTTFB === 'function') {
      webVitals.onTTFB((metric: any) => {
        trackMetric({
          name: 'Time to First Byte',
          value: metric.value,
          unit: 'ms',
          tags: { id: metric.id }
        });
      });
    }
  });
};

/**
 * Create a performance monitoring hook for React components
 * @param componentName Name of the component to monitor
 * @returns An object with methods to track component performance
 */
export const useComponentPerformance = (componentName: string) => {
  let renderStartTime = 0;
  
  const startRender = () => {
    renderStartTime = performance.now();
  };
  
  const endRender = () => {
    const renderTime = performance.now() - renderStartTime;
    trackMetric({
      name: `${componentName}_render_time`,
      value: Math.round(renderTime),
      unit: 'ms'
    });
  };
  
  return {
    startRender,
    endRender
  };
};

/**
 * Track API call performance
 * @param url API endpoint URL
 * @param method HTTP method
 * @param startTime Start time of the request
 * @param endTime End time of the request
 * @param success Whether the request was successful
 */
export const trackApiPerformance = (
  url: string,
  method: string,
  startTime: number,
  endTime: number,
  success: boolean
) => {
  const duration = endTime - startTime;
  
  trackMetric({
    name: 'api_call_duration',
    value: Math.round(duration),
    unit: 'ms',
    tags: {
      url,
      method,
      success: success.toString()
    }
  });
  
  // Report to Sentry if the API call is slow (over 1 second)
  if (duration > 1000) {
    Sentry.captureMessage(`Slow API call: ${method} ${url} took ${Math.round(duration)}ms`, {
      level: 'warning',
      tags: {
        url,
        method,
        duration: Math.round(duration).toString()
      }
    });
  }
};
