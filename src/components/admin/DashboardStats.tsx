
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
import { useMemo } from "react";

export default function DashboardStats() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Fetch agents, offices, and invitations data
      const [agentsResult, officesResult, invitationsResult] = await Promise.all([
        supabase.from('sub_agents').select('count'),
        supabase.from('sub_offices').select('count'),
        supabase.from('profiles').select('count').eq('role', 'sales_agent')
      ]);

      // Fetch agreements data
      const { data: agreementsData, error: agreementsError } = await supabase
        .from('agreements')
        .select('id, status');
      
      if (agreementsError) throw agreementsError;
      
      // Fetch agreement signatures data
      const { data: signaturesData, error: signaturesError } = await supabase
        .from('agreement_signatures')
        .select('id, agreement_id');
      
      if (signaturesError) throw signaturesError;
      
      // Create a set of signed agreement IDs
      const signedAgreementIds = new Set(signaturesData?.map(sig => sig.agreement_id) || []);
      
      // Calculate counts for different agreement statuses
      let pendingCount = 0;
      let signedCount = signedAgreementIds.size; // Count from signatures table
      let draftCount = 0;
      
      // Count agreements by status
      agreementsData?.forEach(agreement => {
        if (signedAgreementIds.has(agreement.id)) {
          // Already counted in signedCount
        } else if (agreement.status === 'submitted') {
          pendingCount++;
        } else if (agreement.status === 'draft') {
          draftCount++;
        }
      });
      
      // Total agreements count
      const totalAgreements = agreementsData?.length || 0;

      return {
        totalAgents: agentsResult.data?.[0]?.count || 0,
        totalAgreements: totalAgreements,
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

  // Memoize the stats cards to prevent unnecessary re-renders
  const statsCards = useMemo(() => {
    if (!stats) return null;
    
    const cards = [
      {
        title: "Total Agents",
        value: stats.totalAgents,
        description: "Sales agents onboarded",
        icon: <Users className="h-4 w-4 text-muted-foreground" />
      },
      {
        title: "Pending Invitations",
        value: stats.pendingInvitations,
        description: "Awaiting acceptance",
        icon: <MailPlus className="h-4 w-4 text-muted-foreground" />
      },
      {
        title: "Total Offices",
        value: stats.totalOffices,
        description: "Registered locations",
        icon: <Building className="h-4 w-4 text-muted-foreground" />
      },
      {
        title: "Agreements",
        value: stats.totalAgreements,
        description: (
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Signed: {stats.signedAgreements}</span>
            <span>Pending: {stats.submittedAgreements}</span>
            <span>Draft: {stats.draftAgreements}</span>
          </div>
        ),
        icon: <FileText className="h-4 w-4 text-muted-foreground" />
      }
    ];
    
    return cards.map((card, index) => (
      <Card key={index} className="sm:max-w-full md:max-w-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
          {card.icon}
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{card.value}</p>
          {typeof card.description === 'string' ? (
            <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
          ) : (
            card.description
          )}
        </CardContent>
      </Card>
    ));
  }, [stats]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsCards}
    </div>
  );
}

