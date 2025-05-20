import 'vite/modulepreload-polyfill'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import { Replay } from '@sentry/replay'
import App from './App.tsx'
import './fonts.css'
import './globals.css'
import ErrorBoundary from './components/ErrorBoundary'
import { initializeSentry, captureException, setUser } from './utils/errorTracking'
import { register as registerServiceWorker } from './serviceWorkerRegistration'
import { Workbox } from 'workbox-window'
import { setupWebVitalsTracking } from './utils/performanceMonitoring'

// Initialize Sentry for error tracking with our enhanced configuration
initializeSentry({
  dsn: import.meta.env.VITE_SENTRY_DSN || '',
  environment: import.meta.env.MODE || 'development',
  debug: import.meta.env.MODE === 'development',
  tracesSampleRate: import.meta.env.MODE === 'production' ? 0.2 : 1.0,
  integrations: [
    new BrowserTracing({
      tracePropagationTargets: ['localhost', /^\/api/, new RegExp(window.location.origin)],
    }),
    new Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  // Enable performance monitoring
  enableTracing: true,
});

// Setup web vitals tracking for performance monitoring
setupWebVitalsTracking();

// Create a client
const queryClient = new QueryClient()

// Add enhanced error logging with Sentry
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  captureException(event.error, {
    errorSource: 'window.onerror',
    errorType: event.error?.name || 'Error',
    errorLocation: `${event.filename}:${event.lineno}:${event.colno}`
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  captureException(
    event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
    {
      errorSource: 'unhandledrejection',
      errorType: event.reason?.name || 'UnhandledPromiseRejection'
    }
  );
});

// Track route changes for performance monitoring
let routeChangeStart = 0;
window.addEventListener('popstate', () => {
  routeChangeStart = performance.now();
  Sentry.addBreadcrumb({
    category: 'navigation',
    message: `Route changed to: ${window.location.pathname}`,
    data: {
      from: document.referrer,
      to: window.location.href
    }
  });
});

// Monitor page load performance
window.addEventListener('load', () => {
  if (performance && 'getEntriesByType' in performance) {
    const perfEntries = performance.getEntriesByType('navigation');
    if (perfEntries.length > 0) {
      const timing = perfEntries[0] as PerformanceNavigationTiming;
      Sentry.captureMessage('Page Load Performance', {
        level: 'info',
        tags: { type: 'performance' },
        contexts: {
          performance: {
            domInteractive: timing.domInteractive,
            domComplete: timing.domComplete,
            loadEventEnd: timing.loadEventEnd,
            navigationStart: timing.startTime,
            ttfb: timing.responseStart - timing.startTime
          }
        }
      });
    }
  }
});

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found!");
}

// Create a Sentry-wrapped app for better error tracking
const SentryApp = Sentry.withProfiler(
  () => (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  ),
  { name: 'AgentAgreementNexusApp' }
);

createRoot(root).render(<SentryApp />);

// Register service worker for offline capabilities and caching
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  const wb = new Workbox(`${import.meta.env.BASE_URL}service-worker.js`);

  // Add event listeners for service worker lifecycle events
  wb.addEventListener('installed', event => {
    console.log('Service worker installed:', event);
    Sentry.addBreadcrumb({
      category: 'service-worker',
      message: 'Service worker installed',
      level: 'info'
    });
  });

  wb.addEventListener('activated', event => {
    console.log('Service worker activated:', event);
    Sentry.addBreadcrumb({
      category: 'service-worker',
      message: 'Service worker activated',
      level: 'info'
    });
  });

  wb.addEventListener('waiting', event => {
    console.log('Service worker waiting:', event);
    // When a new service worker is waiting, show the update notification
    wb.register().then(registration => {
      if (registration) {
        import('./components/ServiceWorkerUpdateNotification').then(({ default: ServiceWorkerUpdateNotification }) => {
          const root = document.createElement('div');
          document.body.appendChild(root);
          createRoot(root).render(<ServiceWorkerUpdateNotification registration={registration} />);
        });
      }
    });
  });

  wb.addEventListener('redundant', event => {
    console.log('Service worker redundant:', event);
    Sentry.addBreadcrumb({
      category: 'service-worker',
      message: 'Service worker redundant',
      level: 'error'
    });
  });

  // Register the service worker
  wb.register().then(registration => {
    console.log('Service worker registered:', registration);
  }).catch(error => {
    console.error('Service worker registration failed:', error);
    Sentry.captureException(error, {
      tags: {
        source: 'service-worker-registration'
      }
    });
  });
}
