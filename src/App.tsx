import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import { Agreements } from './pages/Agreements';
import { AuthProvider } from './hooks/useAuth';
import { Toaster } from './components/ui/toaster';
import { useAuth } from './hooks/useAuth';
import { UserRole } from './lib/roles';

// Protected route component
const ProtectedRoute = ({ element, requiredRoles = [] }: { element: React.ReactNode, requiredRoles?: UserRole[] }) => {
  const { user, userRoles, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRoles.length > 0 && !requiredRoles.some(role => userRoles.includes(role as UserRole))) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{element}</>;
};

// Admin routes
const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/agreements" element={<ProtectedRoute element={<div>Admin Agreements</div>} requiredRoles={['admin' as UserRole]} />} />
      <Route path="/admin/users" element={<ProtectedRoute element={<div>Admin Users</div>} requiredRoles={['admin' as UserRole]} />} />
      <Route path="/admin/*" element={<Navigate to="/admin/agreements" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/agreements" element={<ProtectedRoute element={<Agreements />} />} />
            <Route path="/agents" element={<ProtectedRoute element={<div>Agents Page</div>} />} />
            <Route path="/analytics" element={<ProtectedRoute element={<div>Analytics Page</div>} />} />
            <Route path="/settings" element={<ProtectedRoute element={<div>Settings Page</div>} />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
        <Toaster />
      </Router>
    </AuthProvider>
  );
};

export default App;
