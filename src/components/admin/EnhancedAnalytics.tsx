import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  FileCheck, 
  GraduationCap, 
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { useState } from "react";

export default function EnhancedAnalytics() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['enhanced-analytics', timeRange],
    queryFn: async () => {
      // Fetch agent counts
      const { data: agentsData, error: agentsError } = await supabase
        .from('profiles')
        .select('id, role, created_at')
        .in('role', ['sales_agent', 'senior_agent']);
      
      if (agentsError) throw agentsError;
      
      // Fetch agreements data
      const { data: agreementsData, error: agreementsError } = await supabase
        .from('agreements')
        .select('id, status, user_id, created_at');
      
      if (agreementsError) throw agreementsError;
      
      // Fetch agreement signatures
      const { data: signaturesData, error: signaturesError } = await supabase
        .from('agreement_signatures')
        .select('id, agreement_id, user_id, signed_at');
      
      if (signaturesError) throw signaturesError;
      
      // Fetch training completion data (assuming there's a training_completion table)
      // If this table doesn't exist, you'll need to create it or modify this query
      const { data: trainingData, error: trainingError } = await supabase
        .from('training_completion')
        .select('id, user_id, module, completed_at, status');
      
      // If the table doesn't exist yet, we'll handle it gracefully
      const trainingResults = trainingError ? [] : trainingData || [];
      
      // Calculate metrics
      const totalAgents = agentsData?.length || 0;
      const activeAgents = agentsData?.filter(agent => 
        // Consider an agent active if they were created in the last 30 days or have signed agreements
        new Date(agent.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ||
        signaturesData?.some(sig => sig.user_id === agent.id)
      ).length || 0;
      
      // Calculate agreement metrics
      const totalAgreements = agreementsData?.length || 0;
      const signedAgreements = agreementsData?.filter(a => a.status === 'signed').length || 0;
      const signatureRate = totalAgreements > 0 ? (signedAgreements / totalAgreements) * 100 : 0;
      
      // Calculate training completion metrics
      const agentsWithTraining = new Set(trainingResults.map(t => t.user_id));
      const completedAllTraining = new Set();
      
      // Count agents who completed all training modules
      trainingResults.forEach(t => {
        if (t.status === 'completed') {
          completedAllTraining.add(t.user_id);
        }
      });
      
      const trainingRate = totalAgents > 0 ? (completedAllTraining.size / totalAgents) * 100 : 0;
      
      // Calculate agents needing approval (those with completed training but no signed agreements)
      const agentsNeedingApproval = agentsData?.filter(agent => 
        completedAllTraining.has(agent.id) && 
        !signaturesData?.some(sig => sig.user_id === agent.id)
      ) || [];
      
      return {
        totalAgents,
        activeAgents,
        activeRate: totalAgents > 0 ? (activeAgents / totalAgents) * 100 : 0,
        signatureRate,
        trainingRate,
        agentsNeedingApproval: agentsNeedingApproval.length,
        recentAgents: agentsData?.slice(0, 5) || [],
      };
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
  
  if (isLoading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Agent Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 animate-pulse bg-muted rounded-md" />
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Agent Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-destructive/15 p-4 text-destructive">
            <p>Error loading analytics. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Agent Analytics Dashboard</CardTitle>
        <Tabs defaultValue="month" onValueChange={(v) => setTimeRange(v as any)}>
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="quarter">Quarter</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Agent Metrics */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Agent Metrics</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Total Agents</span>
                  <span className="text-sm font-medium">{data?.totalAgents}</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Active Agents</span>
                  <span className="text-sm font-medium">{data?.activeAgents} ({Math.round(data?.activeRate || 0)}%)</span>
                </div>
                <Progress value={data?.activeRate} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Agents Needing Approval</span>
                  <span className="text-sm font-medium">{data?.agentsNeedingApproval}</span>
                </div>
                <div className="flex items-center text-amber-500 text-xs mt-1">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  <span>Agents with completed training awaiting approval</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Agreement Metrics */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Agreement Metrics</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Agreement Signature Rate</span>
                  <span className="text-sm font-medium">{Math.round(data?.signatureRate || 0)}%</span>
                </div>
                <Progress value={data?.signatureRate} className="h-2" />
              </div>
              <div className="pt-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-green-50 rounded-md p-2">
                    <div className="text-green-600 font-medium text-lg">Good</div>
                    <div className="text-xs text-muted-foreground">90-100%</div>
                  </div>
                  <div className="bg-amber-50 rounded-md p-2">
                    <div className="text-amber-600 font-medium text-lg">Average</div>
                    <div className="text-xs text-muted-foreground">70-89%</div>
                  </div>
                  <div className="bg-red-50 rounded-md p-2">
                    <div className="text-red-600 font-medium text-lg">Poor</div>
                    <div className="text-xs text-muted-foreground">0-69%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Training Metrics */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Training Completion</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Training Completion Rate</span>
                  <span className="text-sm font-medium">{Math.round(data?.trainingRate || 0)}%</span>
                </div>
                <Progress value={data?.trainingRate} className="h-2" />
              </div>
              <div className="pt-4">
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-muted stroke-current"
                        strokeWidth="10"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                      ></circle>
                      <circle
                        className="text-primary stroke-current"
                        strokeWidth="10"
                        strokeLinecap="round"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - data?.trainingRate / 100)}`}
                        transform="rotate(-90 50 50)"
                      ></circle>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{Math.round(data?.trainingRate || 0)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
