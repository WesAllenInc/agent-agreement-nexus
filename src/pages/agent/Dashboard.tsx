
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import DocumentsList from "@/components/agent/documents/DocumentsList";
import ProfileOverview from "@/components/agent/profile/ProfileOverview";
import ExternalLinks from "@/components/agent/dashboard/ExternalLinks";
import DocumentDownload from "@/components/agent/dashboard/DocumentDownload";

export default function AgentDashboard() {
  const { data: executedAgreements, isLoading: isLoadingDocuments } = useQuery({
    queryKey: ['executed-agreements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('executed_agreements')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Sales Agent Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ProfileOverview />
            <div className="mt-6">
              <ExternalLinks />
            </div>
          </div>
          
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingDocuments ? (
                  <div className="flex items-center justify-center h-32 text-muted-foreground">
                    Loading documents...
                  </div>
                ) : (
                  <DocumentsList documents={executedAgreements || []} />
                )}
              </CardContent>
            </Card>
            
            <DocumentDownload />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

