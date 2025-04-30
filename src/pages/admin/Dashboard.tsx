
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";
import DocumentsList from "@/components/agent/documents/DocumentsList";
import DashboardStats from "@/components/admin/DashboardStats";
import AgreementStatusChart from "@/components/admin/AgreementStatusChart";
import RecentSignupsChart from "@/components/admin/RecentSignupsChart";
import AgentActivityDashboard from "@/components/admin/AgentActivityDashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminDashboard() {
  const { data: executedAgreements, isLoading: isLoadingDocuments } = useQuery({
    queryKey: ['executed-agreements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('executed_agreements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: subOffices, isLoading: isLoadingOffices } = useQuery({
    queryKey: ['sub-offices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sub_offices')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: subAgents, isLoading: isLoadingAgents } = useQuery({
    queryKey: ['sub-agents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sub_agents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <MainLayout isAdmin>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        <DashboardStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AgreementStatusChart />
          <RecentSignupsChart />
        </div>
        
        <AgentActivityDashboard />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Agreements</CardTitle>
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

          <Card>
            <CardHeader>
              <CardTitle>Recent Sub-Offices</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingOffices ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  Loading offices...
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Office Name</TableHead>
                      <TableHead>Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subOffices?.map((office) => (
                      <TableRow key={office.id}>
                        <TableCell>
                          <div className="font-medium">{office.office_name}</div>
                          <div className="text-sm text-muted-foreground">{office.office_phone}</div>
                        </TableCell>
                        <TableCell>
                          {office.office_city}, {office.office_state}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Sub-Agents</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingAgents ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  Loading agents...
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent Name</TableHead>
                      <TableHead>Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subAgents?.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell>
                          <div className="font-medium">{agent.agent_name}</div>
                        </TableCell>
                        <TableCell>
                          {agent.agent_city}, {agent.agent_state}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

