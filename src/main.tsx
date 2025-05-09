import 'vite/modulepreload-polyfill'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './fonts.css'
import './globals.css'
import ErrorBoundary from './components/ErrorBoundary'

// Create a client
const queryClient = new QueryClient()

// Add error logging
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
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
