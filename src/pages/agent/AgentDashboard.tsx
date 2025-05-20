import React, { Suspense } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DocumentDownload from '@/components/agent/dashboard/DocumentDownload';
import ExternalLinks from '@/components/agent/dashboard/ExternalLinks';
import OnboardingStatus from '@/components/agent/dashboard/OnboardingStatus';
import AgreementAttachmentsStatus from '@/components/agent/dashboard/AgreementAttachmentsStatus';
import { Loading } from '@/components/ui/loading';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import AuthErrorHandler from '@/components/auth/AuthErrorHandler';
import { useAuth } from '@/hooks/useAuth';

const AgentDashboard = () => {
  const { loading: authLoading } = useAuth();
  
  if (authLoading) {
    return <Loading text="Loading dashboard..." fullPage />;
  }
  return (
    <MainLayout>
      {/* Display any auth errors */}
      <AuthErrorHandler />
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Welcome to your sales agent dashboard
          </p>
        </div>

        <ErrorBoundary title="Onboarding Status Error">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Onboarding Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Loading text="Loading onboarding status..." />}>
                <OnboardingStatus />
              </Suspense>
            </CardContent>
          </Card>
        </ErrorBoundary>

        <div className="grid gap-6 md:grid-cols-2">
          <ErrorBoundary title="Documents Error">
            <Card>
              <CardHeader>
                <CardTitle>Your Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Loading text="Loading documents..." />}>
                  <DocumentDownload />
                </Suspense>
              </CardContent>
            </Card>
          </ErrorBoundary>

          <ErrorBoundary title="Quick Links Error">
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Loading text="Loading links..." />}>
                  <ExternalLinks />
                </Suspense>
              </CardContent>
            </Card>
          </ErrorBoundary>
          
          <ErrorBoundary title="Agreement Attachments Error">
            <Suspense fallback={<Loading text="Loading attachments status..." />}>
              <AgreementAttachmentsStatus />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </MainLayout>
  );
};

export default AgentDashboard;

