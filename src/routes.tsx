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

// New enterprise feature components
const MainLayout = React.lazy(() => import('./layouts/MainLayout'));
const Settings = React.lazy(() => import('./pages/settings/Settings'));
const ProfileSettings = React.lazy(() => import('./pages/settings/Profile'));
const SecuritySettings = React.lazy(() => import('./pages/settings/Security'));
const Preferences = React.lazy(() => import('./pages/settings/Preferences'));
const NotificationSettings = React.lazy(() => import('./pages/settings/Notifications'));
const AuditLog = React.lazy(() => import('./pages/admin/AuditLog'));
const ImportExport = React.lazy(() => import('./pages/admin/ImportExport'));

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
    element: <ProtectedRoute><Suspense fallback={<LoadingFallback />}><MainLayout /></Suspense></ProtectedRoute>,
    children: [
      {
        path: '/',
        element: LazyWrapper(Index),
      },
      {
        path: '/agent/agreement',
        element: LazyWrapper(Agreement),
      },
      {
        path: '/agent/dashboard',
        element: LazyWrapper(AgentDashboard),
      },
      {
        path: '/agent/documents',
        element: LazyWrapper(AgentDocuments),
      },
      {
        path: '/agent/profile',
        element: LazyWrapper(Profile),
      },
      {
        path: '/advanced-search',
        element: LazyWrapper(AdvancedSearch),
      },
      {
        path: '/test-upload',
        element: LazyWrapper(TestAgreementUpload),
      },
      // New settings routes
      {
        path: '/settings',
        element: LazyWrapper(Settings),
        children: [
          {
            path: 'profile',
            element: LazyWrapper(ProfileSettings),
          },
          {
            path: 'security',
            element: LazyWrapper(SecuritySettings),
          },
          {
            path: 'preferences',
            element: LazyWrapper(Preferences),
          },
          {
            path: 'notifications',
            element: LazyWrapper(NotificationSettings),
          },
        ],
      },
    ],
  },
];

// Admin routes (admin role required)
export const adminRoutes: RouteObject[] = [
  {
    path: '/',
    element: <ProtectedRoute requiredRole="admin"><Suspense fallback={<LoadingFallback />}><MainLayout /></Suspense></ProtectedRoute>,
    children: [
      {
        path: '/dashboard',
        element: LazyWrapper(Dashboard),
      },
      {
        path: '/users',
        element: LazyWrapper(Users),
      },
      {
        path: '/invitations',
        element: LazyWrapper(Invitations),
      },
      {
        path: '/agents',
        element: LazyWrapper(Agents),
      },
      {
        path: '/agreements',
        element: LazyWrapper(Agreements),
      },
      {
        path: '/agreements/:id',
        element: LazyWrapper(AgreementDetails),
      },
      {
        path: '/templates',
        element: LazyWrapper(Templates),
      },
      // New admin routes
      {
        path: '/admin/audit-log',
        element: LazyWrapper(AuditLog),
      },
      {
        path: '/admin/import-export',
        element: LazyWrapper(ImportExport),
      },
    ],
  },
];
