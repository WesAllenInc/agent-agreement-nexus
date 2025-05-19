import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/roles';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading, isAdmin, isAgent, isSeniorAgent, isApproved } = useAuth();

  if (loading) {
    // Show loading state
    return <div>Loading...</div>;
  }

  if (!user) {
    // Not logged in, redirect to login page
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole) {
    // Check if user has the required role
    if (requiredRole === 'admin' && !isAdmin) {
      return <Navigate to="/" replace />;
    }
    if (requiredRole === 'agent' && !isAgent) {
      return <Navigate to="/" replace />;
    }
    if (requiredRole === 'senior_agent' && !isSeniorAgent && !isAdmin) {
      // Allow admins to access senior agent pages
      return <Navigate to="/" replace />;
    }
  }
  
  // Check if user is approved (admins are automatically approved)
  if (!isAdmin && !isApproved && window.location.pathname !== '/pending-approval') {
    return <Navigate to="/pending-approval" replace />;
  }

  return <>{children}</>;
}

