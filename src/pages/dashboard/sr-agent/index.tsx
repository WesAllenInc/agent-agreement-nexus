import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import AgentStatusTable from "@/components/senior-agent/AgentStatusTable";
import SeniorAgentInviteForm from "@/components/senior-agent/SeniorAgentInviteForm";
import InvitationsList from "@/components/invitations/InvitationsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function SeniorAgentDashboard() {
  const { isSeniorAgent, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if not a senior agent or admin
  useEffect(() => {
    if (!loading && !isSeniorAgent && !isAdmin) {
      navigate("/dashboard");
    }
  }, [isSeniorAgent, isAdmin, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Senior Agent Dashboard</h1>
        </div>

        <Tabs defaultValue="agents" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="agents">Agent Management</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="agents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Agent Onboarding Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AgentStatusTable />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="invitations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <SeniorAgentInviteForm />
              </div>
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Invitations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <InvitationsList />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
