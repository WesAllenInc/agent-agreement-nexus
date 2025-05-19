import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";

type AgentStatus = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  has_signed_agreement: boolean;
  agreement_count: number;
  last_agreement_date: string | null;
};

export default function AgentStatusTable() {
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgentStatus();
  }, []);

  const fetchAgentStatus = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('agent_onboarding_status')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setAgents(data || []);
    } catch (error: any) {
      toast.error("Error loading agent status: " + error.message);
      console.error("Error fetching agent status:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (agent: AgentStatus) => {
    if (agent.has_signed_agreement) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Completed
        </Badge>
      );
    } else if (agent.agreement_count > 0) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          In Progress
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
          Not Started
        </Badge>
      );
    }
  };

  const formatName = (agent: AgentStatus) => {
    if (agent.first_name && agent.last_name) {
      return `${agent.first_name} ${agent.last_name}`;
    } else if (agent.first_name) {
      return agent.first_name;
    } else if (agent.last_name) {
      return agent.last_name;
    } else {
      return "Unknown";
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading agent status...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Onboarding Status</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No agents found
              </TableCell>
            </TableRow>
          ) : (
            agents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell>{formatName(agent)}</TableCell>
                <TableCell>{agent.email}</TableCell>
                <TableCell>
                  {format(new Date(agent.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell>{getStatusBadge(agent)}</TableCell>
                <TableCell>
                  {agent.last_agreement_date
                    ? format(new Date(agent.last_agreement_date), "MMM d, yyyy")
                    : "No activity"}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // This would navigate to a detailed view of the agent
                      // For now just show a toast
                      toast.info(`Viewing details for ${formatName(agent)}`);
                    }}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
