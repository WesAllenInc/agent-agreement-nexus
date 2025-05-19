import { RouteObject } from 'react-router-dom';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Invitations from './pages/admin/Invitations';
import Agreements from './pages/admin/Agreements';
import PendingApproval from './pages/PendingApproval';
import AgreementDetails from './pages/admin/AgreementDetails';
import TrainingManager from './pages/admin/TrainingManager';
import Agreement from './pages/agent/Agreement';
import AcceptInvitation from './pages/AcceptInvitation';
import Agents from './pages/admin/Agents';
import AgentDashboard from './pages/agent/AgentDashboard';
import AgentDocuments from './pages/agent/AgentDocuments';
import AgentTraining from './pages/agent/Training';
import Auth from './pages/auth/Auth';
import Index from './pages/Index';
import { TestAgreementUpload } from './pages/TestAgreementUpload';
import { ProtectedRoute } from './components/ProtectedRoute';
import SeniorAgentDashboard from './pages/dashboard/sr-agent';
import AgreementsList from './pages/agreements/index';
import AgreementView from './pages/agreements/AgreementView';
import ProfileSettings from './pages/profile';

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
  {
    path: '/pending-approval',
    element: <PendingApproval />,
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
  {
    path: '/agreements',
    element: (
      <ProtectedRoute>
        <AgreementsList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/agreements/:id',
    element: (
      <ProtectedRoute>
        <AgreementView />
      </ProtectedRoute>
    ),
  },
  {
    path: '/agent/training',
    element: (
      <ProtectedRoute>
        <AgentTraining />
      </ProtectedRoute>
    ),
  },
  {
    path: '/agent/training/:moduleId/:materialId',
    element: (
      <ProtectedRoute>
        <AgentTraining />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfileSettings />
      </ProtectedRoute>
    ),
  },
];

// Senior agent routes
export const seniorAgentRoutes: RouteObject[] = [
  {
    path: '/dashboard/sr-agent',
    element: (
      <ProtectedRoute requiredRole="senior_agent">
        <SeniorAgentDashboard />
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
  {
    path: '/training',
    element: (
      <ProtectedRoute requiredRole="admin">
        <TrainingManager />
      </ProtectedRoute>
    ),
  },
];

