import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole, hasRole } from '../lib/roles';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, userRoles } = useAuth();

  if (!user) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole(userRoles, requiredRole)) {
    // User's role doesn't match, redirect to home page
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
