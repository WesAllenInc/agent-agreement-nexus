
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import DocumentsList from "@/components/agent/documents/DocumentsList";
import ProfileOverview from "@/components/agent/profile/ProfileOverview";

export default function AgentDashboard() {
  const { data: executedAgreements } = useQuery({
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileOverview />
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentsList documents={executedAgreements || []} />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
