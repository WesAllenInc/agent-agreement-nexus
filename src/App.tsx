import React from 'react';
import { useRoutes } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './providers/NotificationProvider';
import { publicRoutes, protectedRoutes, adminRoutes, seniorAgentRoutes } from './routes';
import { Toaster } from './components/ui/toaster';
import { InstallPrompt } from './components/pwa/InstallPrompt';
import { useBackgroundSync } from './utils/useBackgroundSync';

const App: React.FC = () => {
  useBackgroundSync();
  // Combine all routes
  const allRoutes = [...publicRoutes, ...protectedRoutes, ...adminRoutes, ...seniorAgentRoutes];
  const element = useRoutes(allRoutes);
  
  return (
    <>
      <InstallPrompt />
      <Sentry.ErrorBoundary fallback={({ error, componentStack, resetError }) => (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full px-6">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-destructive">Something went wrong</h1>
              <pre className="text-sm text-muted-foreground bg-muted p-4 rounded-lg overflow-auto">
                {error.toString()}
                <div className="mt-2 text-xs">{componentStack}</div>
              </pre>
              <button
                onClick={resetError}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}>
        <AuthProvider>
          <NotificationProvider>
            {element}
            <Toaster />
          </NotificationProvider>
        </AuthProvider>
      </Sentry.ErrorBoundary>
    </>
  );
};

export default App;
