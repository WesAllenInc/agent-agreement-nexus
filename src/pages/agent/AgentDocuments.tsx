
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DocumentsList from '@/components/agent/documents/DocumentsList';

const AgentDocuments = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            View and download your documents
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentsList />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AgentDocuments;
