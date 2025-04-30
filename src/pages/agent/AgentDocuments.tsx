
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DocumentsList from '@/components/agent/documents/DocumentsList';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AgentDocuments = () => {
  // Add a query to fetch documents or use mock data
  const { data: documents, isLoading } = useQuery({
    queryKey: ['agent-documents'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('executed_agreements')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error loading documents:', error);
        return [];
      }
    }
  });

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
            {isLoading ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                Loading documents...
              </div>
            ) : (
              <DocumentsList documents={documents || []} />
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AgentDocuments;

