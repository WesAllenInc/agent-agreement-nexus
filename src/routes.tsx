import { RouteObject } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Loading } from './components/ui/loading';

// Lazy load page components for code splitting
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Users = lazy(() => import('./pages/admin/Users'));
const Invitations = lazy(() => import('./pages/admin/Invitations'));
const Agreements = lazy(() => import('./pages/admin/Agreements'));
const PendingApproval = lazy(() => import('./pages/PendingApproval'));
const AgreementDetails = lazy(() => import('./pages/admin/AgreementDetails'));
const TrainingManager = lazy(() => import('./pages/admin/TrainingManager'));
const Agreement = lazy(() => import('./pages/agent/Agreement'));
const AcceptInvitation = lazy(() => import('./pages/AcceptInvitation'));
const Agents = lazy(() => import('./pages/admin/Agents'));
const AgentDashboard = lazy(() => import('./pages/agent/AgentDashboard'));
const AgentDocuments = lazy(() => import('./pages/agent/AgentDocuments'));
const AgentTraining = lazy(() => import('./pages/agent/Training'));
const BankingInfo = lazy(() => import('./pages/agent/BankingInfo'));
const Auth = lazy(() => import('./pages/auth/Auth'));
const Index = lazy(() => import('./pages/Index'));
const TestAgreementUpload = lazy(() => import('./pages/TestAgreementUpload').then(module => ({ default: module.TestAgreementUpload })));
const SeniorAgentDashboard = lazy(() => import('./pages/dashboard/sr-agent'));
const AgreementsList = lazy(() => import('./pages/agreements/index'));
const AgreementView = lazy(() => import('./pages/agreements/AgreementView'));
const ProfileSettings = lazy(() => import('./pages/profile'));

// Suspense wrapper component
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<Loading className="h-screen" />}>
    {children}
  </Suspense>
);

// Public routes (no authentication required)
export const publicRoutes: RouteObject[] = [
  {
    path: '/auth',
    element: <SuspenseWrapper><Auth /></SuspenseWrapper>,
  },
  {
    path: '/invitation/accept',
    element: <SuspenseWrapper><AcceptInvitation /></SuspenseWrapper>,
  },
  {
    path: '/pending-approval',
    element: <SuspenseWrapper><PendingApproval /></SuspenseWrapper>,
  },
];

// Protected routes (authentication required)
export const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <Index />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/agent/agreement',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <Agreement />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/agent/dashboard',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <AgentDashboard />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/agent/documents',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <AgentDocuments />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/test-upload',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <TestAgreementUpload />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/agreements',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <AgreementsList />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/agreements/:id',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <AgreementView />
        </SuspenseWrapper>
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
        <SuspenseWrapper>
          <AgentTraining />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <ProfileSettings />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/agent/banking',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <BankingInfo />
        </SuspenseWrapper>
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
        <SuspenseWrapper>
          <SeniorAgentDashboard />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/invitations',
    element: (
      <ProtectedRoute requiredRole="senior_agent">
        <SuspenseWrapper>
          <Invitations />
        </SuspenseWrapper>
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
        <SuspenseWrapper>
          <Dashboard />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/users',
    element: (
      <ProtectedRoute requiredRole="admin">
        <SuspenseWrapper>
          <Users />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/invitations',
    element: (
      <ProtectedRoute requiredRole="admin">
        <SuspenseWrapper>
          <Invitations />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/agents',
    element: (
      <ProtectedRoute requiredRole="admin">
        <SuspenseWrapper>
          <Agents />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/agreements',
    element: (
      <ProtectedRoute requiredRole="admin">
        <SuspenseWrapper>
          <Agreements />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/agreements/:id',
    element: (
      <ProtectedRoute requiredRole="admin">
        <SuspenseWrapper>
          <AgreementDetails />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/training',
    element: (
      <ProtectedRoute requiredRole="admin">
        <SuspenseWrapper>
          <TrainingManager />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
];

