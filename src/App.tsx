import React from 'react';
import { useRoutes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './providers/NotificationProvider';
import { publicRoutes, protectedRoutes, adminRoutes, seniorAgentRoutes } from './routes';
import { Toaster } from './components/ui/toaster';

const App: React.FC = () => {
  // Combine all routes
  const allRoutes = [...publicRoutes, ...protectedRoutes, ...adminRoutes, ...seniorAgentRoutes];
  const element = useRoutes(allRoutes);
  
  return (
    <AuthProvider>
      <NotificationProvider>
        {element}
        <Toaster />
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
