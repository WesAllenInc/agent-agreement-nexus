import { RouteObject } from 'react-router-dom';
import React, { Suspense } from 'react';
import { ProtectedRoute } from './components/ProtectedRoute';

// Use lazy loading for all page components
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const Users = React.lazy(() => import('./pages/admin/Users'));
const Invitations = React.lazy(() => import('./pages/admin/Invitations'));
const Agreements = React.lazy(() => import('./pages/admin/Agreements'));
const AgreementDetails = React.lazy(() => import('./pages/admin/AgreementDetails'));
const Agreement = React.lazy(() => import('./pages/agent/Agreement'));
const AcceptInvitation = React.lazy(() => import('./pages/AcceptInvitation'));
const Agents = React.lazy(() => import('./pages/admin/Agents'));
const AgentDashboard = React.lazy(() => import('./pages/agent/AgentDashboard'));
const AgentDocuments = React.lazy(() => import('./pages/agent/AgentDocuments'));
const Auth = React.lazy(() => import('./pages/auth/Auth'));
const Index = React.lazy(() => import('./pages/Index'));
const TestAgreementUpload = React.lazy(() => import('./pages/TestAgreementUpload').then(module => ({ default: module.TestAgreementUpload })));
const Profile = React.lazy(() => import('./pages/agent/Profile'));
const Help = React.lazy(() => import('./pages/Help'));
const Templates = React.lazy(() => import('./pages/admin/Templates'));
const AdvancedSearch = React.lazy(() => import('./pages/AdvancedSearch'));

// Improved loading component with skeleton UI
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-full max-w-md p-4 space-y-4">
      <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
      </div>
      <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </div>
);

// Wrapper component for lazy-loaded components with better fallback UI
const LazyWrapper = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

// Public routes (no authentication required)
export const publicRoutes: RouteObject[] = [
  {
    path: '/auth',
    element: LazyWrapper(Auth),
  },
  {
    path: '/invitation/accept',
    element: LazyWrapper(AcceptInvitation),
  },
  {
    path: '/help',
    element: LazyWrapper(Help),
  },
];

// Protected routes (authentication required)
export const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        {LazyWrapper(Index)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/agent/agreement',
    element: (
      <ProtectedRoute>
        {LazyWrapper(Agreement)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/agent/dashboard',
    element: (
      <ProtectedRoute>
        {LazyWrapper(AgentDashboard)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/agent/documents',
    element: (
      <ProtectedRoute>
        {LazyWrapper(AgentDocuments)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/agent/profile',
    element: (
      <ProtectedRoute>
        {LazyWrapper(Profile)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/advanced-search',
    element: (
      <ProtectedRoute>
        {LazyWrapper(AdvancedSearch)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/test-upload',
    element: (
      <ProtectedRoute>
        {LazyWrapper(TestAgreementUpload)}
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
        {LazyWrapper(Dashboard)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/users',
    element: (
      <ProtectedRoute requiredRole="admin">
        {LazyWrapper(Users)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/invitations',
    element: (
      <ProtectedRoute requiredRole="admin">
        {LazyWrapper(Invitations)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/agents',
    element: (
      <ProtectedRoute requiredRole="admin">
        {LazyWrapper(Agents)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/agreements',
    element: (
      <ProtectedRoute requiredRole="admin">
        {LazyWrapper(Agreements)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/agreements/:id',
    element: (
      <ProtectedRoute requiredRole="admin">
        {LazyWrapper(AgreementDetails)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/templates',
    element: (
      <ProtectedRoute requiredRole="admin">
        {LazyWrapper(Templates)}
      </ProtectedRoute>
    ),
  },
];
