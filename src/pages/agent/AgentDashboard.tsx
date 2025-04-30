import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DocumentDownload from '@/components/agent/dashboard/DocumentDownload';
import ExternalLinks from '@/components/agent/dashboard/ExternalLinks';

const AgentDashboard = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Welcome to your sales agent dashboard
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentDownload />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <ExternalLinks />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AgentDashboard;

