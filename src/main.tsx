import 'vite/modulepreload-polyfill'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as Sentry from '@sentry/react'
import App from './App.tsx'
import './fonts.css'
import './globals.css'
import ErrorBoundary from './components/ErrorBoundary'

// Initialize Sentry
// Replace with your actual Sentry DSN when in production
Sentry.init({
  dsn: "YOUR_SENTRY_DSN", // Replace with your actual Sentry DSN
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of transactions in development, lower this in production
  environment: import.meta.env.MODE || 'development',
})

// Create a client
const queryClient = new QueryClient()

// Add error logging with Sentry
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  Sentry.captureException(event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  Sentry.captureException(event.reason instanceof Error ? event.reason : new Error(String(event.reason)));
});

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found!");
}

createRoot(root).render(
  <ErrorBoundary>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </ErrorBoundary>
);
