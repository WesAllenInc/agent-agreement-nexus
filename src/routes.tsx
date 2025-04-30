import { RouteObject } from 'react-router-dom';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Invitations from './pages/admin/Invitations';
import Agreements from './pages/admin/Agreements';
import AgreementDetails from './pages/admin/AgreementDetails';
import Agreement from './pages/agent/Agreement';
import AcceptInvitation from './pages/AcceptInvitation';
import Agents from './pages/admin/Agents';
import AgentDashboard from './pages/agent/AgentDashboard';
import AgentDocuments from './pages/agent/AgentDocuments';
import Auth from './pages/auth/Auth';
import Index from './pages/Index';
import { TestAgreementUpload } from './pages/TestAgreementUpload';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public routes (no authentication required)
export const publicRoutes: RouteObject[] = [
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/invitation/accept',
    element: <AcceptInvitation />,
  },
];

// Protected routes (authentication required)
export const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
    ),
  },
  {
    path: '/agent/agreement',
    element: (
      <ProtectedRoute>
        <Agreement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/agent/dashboard',
    element: (
      <ProtectedRoute>
        <AgentDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/agent/documents',
    element: (
      <ProtectedRoute>
        <AgentDocuments />
      </ProtectedRoute>
    ),
  },
  {
    path: '/test-upload',
    element: (
      <ProtectedRoute>
        <TestAgreementUpload />
      </ProtectedRoute>
    ),
  },
];

// Admin routes (admin role required)
export const adminRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute requiredRole="admin">
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/users',
    element: (
      <ProtectedRoute requiredRole="admin">
        <Users />
      </ProtectedRoute>
    ),
  },
  {
    path: '/invitations',
    element: (
      <ProtectedRoute requiredRole="admin">
        <Invitations />
      </ProtectedRoute>
    ),
  },
  {
    path: '/agents',
    element: (
      <ProtectedRoute requiredRole="admin">
        <Agents />
      </ProtectedRoute>
    ),
  },
  {
    path: '/agreements',
    element: (
      <ProtectedRoute requiredRole="admin">
        <Agreements />
      </ProtectedRoute>
    ),
  },
  {
    path: '/agreements/:id',
    element: (
      <ProtectedRoute requiredRole="admin">
        <AgreementDetails />
      </ProtectedRoute>
    ),
  },
];

