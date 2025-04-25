
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, FileText, Building, MailPlus } from "lucide-react";
import { format } from "date-fns";

export default function DashboardStats() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [agentsResult, agreementsResult, officesResult, invitationsResult] = await Promise.all([
        supabase.from('sub_agents').select('count'),
        supabase.from('executed_agreements').select('count, status'),
        supabase.from('sub_offices').select('count'),
        supabase.from('profiles').select('count').eq('role', 'sales_agent')
      ]);

      // Calculate counts for different agreement statuses
      let pendingCount = 0;
      let signedCount = 0;
      let draftCount = 0;
      
      if (agreementsResult.data && agreementsResult.data.length > 0) {
        agreementsResult.data.forEach(row => {
          if (row.status === 'submitted') pendingCount++;
          else if (row.status === 'signed') signedCount++;
          else if (row.status === 'draft') draftCount++;
        });
      }

      return {
        totalAgents: agentsResult.data?.[0]?.count || 0,
        totalAgreements: agreementsResult.data?.[0]?.count || 0,
        totalOffices: officesResult.data?.[0]?.count || 0,
        pendingInvitations: invitationsResult.data?.[0]?.count || 0,
        submittedAgreements: pendingCount,
        signedAgreements: signedCount,
        draftAgreements: draftCount,
        lastUpdated: format(new Date(), 'PPpp')
      };
    }
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-8 bg-muted rounded w-1/2" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-destructive">
        <p>Error loading dashboard statistics. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats?.totalAgents}</p>
          <p className="text-xs text-muted-foreground mt-1">Sales agents onboarded</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Pending Invitations</CardTitle>
          <MailPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats?.pendingInvitations}</p>
          <p className="text-xs text-muted-foreground mt-1">Awaiting acceptance</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Offices</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats?.totalOffices}</p>
          <p className="text-xs text-muted-foreground mt-1">Registered locations</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Agreements</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats?.totalAgreements}</p>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Signed: {stats?.signedAgreements}</span>
            <span>Pending: {stats?.submittedAgreements}</span>
            <span>Draft: {stats?.draftAgreements}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
