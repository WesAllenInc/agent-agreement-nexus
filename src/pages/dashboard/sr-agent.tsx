import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useTrainingCompletions } from '@/hooks/useTrainingCompletions';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Eye, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PendingInvite {
  id: string;
  email: string;
  invited_by: string;
  created_at: string;
  user_id?: string;
}

interface InviteWithStatus extends PendingInvite {
  agreement_status?: string;
  training_percentage: number;
}

export default function SeniorAgentDashboard() {
  const { user } = useAuth();
  const [invites, setInvites] = useState<InviteWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { useOverallProgress } = useTrainingCompletions();

  useEffect(() => {
    const fetchInvites = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // Fetch pending invites created by this senior agent
        const { data: pendingInvites, error: invitesError } = await supabase
          .from('pending_invites')
          .select('*')
          .eq('invited_by', user.id);

        if (invitesError) throw invitesError;

        // Process each invite to get additional data
        const invitesWithStatus = await Promise.all(
          (pendingInvites || []).map(async (invite: PendingInvite) => {
            let agreement_status = "No Agreement";
            let training_percentage = 0;

            // If the invite has a user_id, fetch their agreement status and training completion
            if (invite.user_id) {
              // Fetch agreement status
              const { data: agreementData } = await supabase
                .from('agreements')
                .select('status')
                .eq('user_id', invite.user_id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

              if (agreementData) {
                agreement_status = agreementData.status;
              }

              // Fetch training completion percentage
              const { data: trainingData } = await supabase.rpc('get_user_training_completion', {
                user_id_param: invite.user_id
              });

              if (trainingData) {
                training_percentage = trainingData;
              }
            }

            return {
              ...invite,
              agreement_status,
              training_percentage,
            };
          })
        );

        setInvites(invitesWithStatus);
      } catch (error) {
        console.error("Error fetching invites:", error);
        toast.error("Failed to fetch invited agents data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvites();
  }, [user]);

  const resendInvite = async (inviteId: string) => {
    try {
      const { error } = await supabase.functions.invoke('resend-invite', {
        body: { inviteId },
      });

      if (error) throw error;

      toast.success("Invitation has been resent.");
    } catch (error) {
      console.error("Error resending invite:", error);
      toast.error("Failed to resend invitation.");
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Senior Agent Dashboard</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Invited Agents</CardTitle>
          <CardDescription>
            Manage agents you've invited to the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : invites.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No agents have been invited yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent Email</TableHead>
                    <TableHead>Agreement Status</TableHead>
                    <TableHead>Training Completion</TableHead>
                    <TableHead className="w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invites.map((invite) => (
                    <TableRow key={invite.id}>
                      <TableCell className="font-medium">{invite.email}</TableCell>
                      <TableCell>
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                          {invite.agreement_status || "No Agreement"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={invite.training_percentage} className="h-2 w-full" />
                          <span className="text-xs tabular-nums">{invite.training_percentage}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => resendInvite(invite.id)}
                          >
                            <Send className="h-3.5 w-3.5 mr-1" />
                            Resend
                          </Button>
                          {invite.user_id && (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <Link to={`/users?id=${invite.user_id}`}>
                                <Eye className="h-3.5 w-3.5 mr-1" />
                                View
                              </Link>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
