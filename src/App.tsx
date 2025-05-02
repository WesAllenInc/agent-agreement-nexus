import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import { Agreements } from './pages/Agreements';
import { AuthProvider } from './hooks/useAuth';
import { Toaster } from './components/ui/toaster';
import { useAuth } from './hooks/useAuth';
import { UserRole } from './lib/roles';
import Demo from './pages/Demo';
import Landing from './pages/Landing';

// Protected route component
const ProtectedRoute = ({ element, requiredRoles = [] }: { element: React.ReactNode, requiredRoles?: UserRole[] }) => {
  const { user, userRoles, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (requiredRoles.length > 0 && !requiredRoles.some(role => userRoles.includes(role as UserRole))) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{element}</>;
};

// Layout wrapper component
const LayoutWrapper = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

const App: React.FC = () => {
  // Simplified App component for debugging
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
