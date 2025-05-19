import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useAgreements } from "@/hooks/useAgreements";
import { supabase } from "@/integrations/supabase/client";
import { Agreement } from "@/types/agreement";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AgentProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  business_name?: string;
}

interface AgreementWithAgent extends Agreement {
  agent?: AgentProfile;
}

export default function Agreements() {
  const { agreements, isLoading } = useAgreements();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [agreementsWithAgents, setAgreementsWithAgents] = useState<AgreementWithAgent[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch agent profiles for each agreement
  useEffect(() => {
    const fetchAgentProfiles = async () => {
      if (!agreements || agreements.length === 0) return;
      
      setIsLoadingProfiles(true);
      setError(null);
      
      try {
        // Get unique user IDs from agreements
        const userIds = [...new Set(agreements.map(a => a.user_id))];
        
        // Fetch profiles for these users
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, business_name')
          .in('id', userIds);
        
        if (error) throw error;
        
        // Create a map of user_id to profile for quick lookup
        const profileMap = new Map<string, AgentProfile>();
        profiles?.forEach(profile => profileMap.set(profile.id, profile));
        
        // Combine agreements with agent profiles
        const enrichedAgreements = agreements.map(agreement => ({
          ...agreement,
          agent: profileMap.get(agreement.user_id)
        }));
        
        setAgreementsWithAgents(enrichedAgreements);
      } catch (err) {
        console.error('Error fetching agent profiles:', err);
        setError('Failed to load agent information. Please try again.');
      } finally {
        setIsLoadingProfiles(false);
      }
    };
    
    fetchAgentProfiles();
  }, [agreements]);

  const filteredAgreements = agreementsWithAgents.filter((agreement) => {
    const matchesStatus = statusFilter === "all" || agreement.status === statusFilter;
    const agentName = agreement.agent ? 
      `${agreement.agent.first_name} ${agreement.agent.last_name}`.toLowerCase() : "";
    const agentEmail = agreement.agent?.email?.toLowerCase() || "";
    const businessName = agreement.agent?.business_name?.toLowerCase() || "";
    const fileName = agreement.file_name.toLowerCase();
    
    const matchesSearch = searchTerm === "" || 
      agentName.includes(searchTerm.toLowerCase()) ||
      agentEmail.includes(searchTerm.toLowerCase()) ||
      businessName.includes(searchTerm.toLowerCase()) ||
      fileName.includes(searchTerm.toLowerCase());
      
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Active
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        );
      case "signed":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Signed
          </Badge>
        );
      case "archived":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            Archived
          </Badge>
        );
      default:
        return <Badge>{status || "Unknown"}</Badge>;
    }
  };

  const isLoaderVisible = isLoading || isLoadingProfiles;

  return (
    <MainLayout isAdmin>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Agreements</h1>
          {/* Add agreement button would go here in a real app */}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-64">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="signed">Signed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Input
              placeholder="Search by agent name, email, or file name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoaderVisible ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <span>Loading agreements...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredAgreements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No agreements found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAgreements.map((agreement) => (
                  <TableRow key={agreement.id}>
                    <TableCell>
                      <div className="font-medium">{agreement.file_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {(agreement.file_size / 1024).toFixed(1)} KB
                      </div>
                    </TableCell>
                    <TableCell>
                      {agreement.agent ? (
                        <div>
                          <div className="font-medium">
                            {agreement.agent.first_name} {agreement.agent.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {agreement.agent.email}
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted-foreground italic">
                          Unknown Agent
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(agreement.status)}</TableCell>
                    <TableCell>
                      {format(new Date(agreement.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/agreements/${agreement.id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}

