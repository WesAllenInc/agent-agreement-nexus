import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEmailNotifications } from "@/hooks/useEmailNotifications";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  FileCheck, 
  GraduationCap,
  UserCheck
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Agent {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  created_at: string;
  training_status?: string;
  agreements_status?: string;
}

export default function AgentApprovalPanel() {
  const [activeTab, setActiveTab] = useState("pending");
  const queryClient = useQueryClient();
  const { sendAgentApprovedNotification } = useEmailNotifications();
  
  // Fetch agents data
  const { data, isLoading, error } = useQuery({
    queryKey: ['agent-approval', activeTab],
    queryFn: async () => {
      // Fetch all agents
      const { data: agents, error: agentsError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, role, status, created_at')
        .in('role', ['sales_agent', 'senior_agent']);
      
      if (agentsError) throw agentsError;
      
      // Fetch training completion data
      const { data: trainingData, error: trainingError } = await supabase
        .from('training_completion')
        .select('user_id, status');
      
      // If the table doesn't exist, we'll handle it gracefully
      const trainingResults = trainingError ? [] : trainingData || [];
      
      // Fetch agreements data
      const { data: agreementsData, error: agreementsError } = await supabase
        .from('agreements')
        .select('user_id, status');
      
      if (agreementsError) throw agreementsError;
      
      // Enhance agent data with training and agreement status
      const enhancedAgents = agents?.map(agent => {
        // Check training status
        const completedTraining = trainingResults.some(
          t => t.user_id === agent.id && t.status === 'completed'
        );
        
        // Check agreements status
        const signedAgreements = agreementsData?.filter(
          a => a.user_id === agent.id && a.status === 'signed'
        ).length || 0;
        
        return {
          ...agent,
          training_status: completedTraining ? 'completed' : 'pending',
          agreements_status: signedAgreements > 0 ? 'signed' : 'pending'
        };
      }) || [];
      
      // Filter based on active tab
      if (activeTab === 'pending') {
        return enhancedAgents.filter(agent => 
          agent.status === 'pending' || 
          agent.status === 'review'
        );
      } else if (activeTab === 'approved') {
        return enhancedAgents.filter(agent => 
          agent.status === 'approved'
        );
      } else if (activeTab === 'rejected') {
        return enhancedAgents.filter(agent => 
          agent.status === 'rejected'
        );
      }
      
      return enhancedAgents;
    }
  });
  
  // Mutation for approving agents
  const approveMutation = useMutation({
    mutationFn: async (agentId: string) => {
      // Get agent details first
      const { data: agent, error: agentError } = await supabase
        .from('profiles')
        .select('email, first_name, last_name')
        .eq('id', agentId)
        .single();
      
      if (agentError) throw agentError;
      
      // Update agent status
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'approved' })
        .eq('id', agentId);
      
      if (error) throw error;
      
      return { id: agentId, email: agent.email, name: `${agent.first_name || ''} ${agent.last_name || ''}`.trim() };
    },
    onSuccess: async (agent) => {
      queryClient.invalidateQueries({ queryKey: ['agent-approval'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      
      // Send email notification
      try {
        const portalUrl = `${window.location.origin}/agent/dashboard`;
        await sendAgentApprovedNotification(agent.email, portalUrl);
        toast.success(`Agent approved and notification sent to ${agent.email}`);
      } catch (error) {
        console.error('Failed to send approval notification:', error);
        toast.success('Agent approved successfully, but notification failed to send');
      }
    },
    onError: (error) => {
      toast.error(`Failed to approve agent: ${error.message}`);
    }
  });
  
  // Mutation for rejecting agents
  const rejectMutation = useMutation({
    mutationFn: async (agentId: string) => {
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'rejected' })
        .eq('id', agentId);
      
      if (error) throw error;
      return agentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-approval'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Agent rejected');
    },
    onError: (error) => {
      toast.error(`Failed to reject agent: ${error.message}`);
    }
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'review':
        return <Badge className="bg-amber-100 text-amber-800">Under Review</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Agent Approval</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-60 animate-pulse bg-muted rounded-md" />
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Agent Approval</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-destructive/15 p-4 text-destructive">
            <p>Error loading agent data. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserCheck className="h-5 w-5 mr-2" />
          Agent Approval Panel
        </CardTitle>
        <CardDescription>
          Review and approve agents who have completed training and signed agreements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="pending">
              Pending
              {data?.filter(a => a.status === 'pending' || a.status === 'review').length > 0 && (
                <Badge className="ml-2 bg-amber-100 text-amber-800">
                  {data?.filter(a => a.status === 'pending' || a.status === 'review').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all">All Agents</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {data?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-10 w-10 mx-auto mb-2" />
                <p>No agents found in this category</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Training</TableHead>
                    <TableHead>Agreements</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell>
                        <div className="font-medium">{agent.first_name} {agent.last_name}</div>
                        <div className="text-sm text-muted-foreground">{agent.email}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(agent.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {agent.training_status === 'completed' ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                          ) : (
                            <Clock className="h-4 w-4 text-amber-500 mr-1" />
                          )}
                          <span>{agent.training_status === 'completed' ? 'Completed' : 'Pending'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {agent.agreements_status === 'signed' ? (
                            <FileCheck className="h-4 w-4 text-green-500 mr-1" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                          )}
                          <span>{agent.agreements_status === 'signed' ? 'Signed' : 'Pending'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{format(new Date(agent.created_at), 'PP')}</TableCell>
                      <TableCell className="text-right">
                        {(agent.status === 'pending' || agent.status === 'review') && (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-200 hover:bg-green-50"
                              onClick={() => approveMutation.mutate(agent.id)}
                              disabled={approveMutation.isPending}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => rejectMutation.mutate(agent.id)}
                              disabled={rejectMutation.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                        {agent.status === 'approved' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => rejectMutation.mutate(agent.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Revoke
                          </Button>
                        )}
                        {agent.status === 'rejected' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => approveMutation.mutate(agent.id)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Reinstate
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <GraduationCap className="h-4 w-4 mr-1" />
          <span>Agents must complete training and sign agreements before approval</span>
        </div>
      </CardFooter>
    </Card>
  );
}
