
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, isPast } from "date-fns";
import { Loader2, RefreshCw, Copy, CheckCircle, AlertCircle, Percent } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Invitation {
  id: string;
  email: string;
  status: string;
  created_at: string;
  expires_at: string;
  token: string;
  residual_percent: number;
  accepted_at?: string;
  user_id?: string;
}


export default function InvitationsList() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      
      // Check for expired invitations that still have 'pending' status
      const updatedData = data?.map(invitation => {
        if (invitation.status === 'pending' && isPast(new Date(invitation.expires_at))) {
          return { ...invitation, status: 'expired' };
        }
        return invitation;
      });

      setInvitations(updatedData || []);
    } catch (error: any) {
      console.error('Error fetching invitations:', error.message);
      toast.error('Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "expired":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleResendInvitation = async (invitation: Invitation) => {
    try {
      // Update the invitation in the database
      const newExpiryDate = new Date();
      newExpiryDate.setDate(newExpiryDate.getDate() + 7); // 7 days from now

      const { error } = await supabase
        .from('invitations')
        .update({
          expires_at: newExpiryDate.toISOString(),
          status: 'pending'
        })
        .eq('id', invitation.id);

      if (error) {
        throw error;
        toast.error('Failed to resend invitation');
      }

      // Generate invitation link
      const inviteLink = `${window.location.origin}/invitation/accept?token=${invitation.token}&email=${encodeURIComponent(invitation.email)}`;
      
      // Send invitation email
      const { error: emailError } = await supabase.functions.invoke('sendInvitationEmail', {
        body: { 
          email: invitation.email, 
          inviteLink,
          residualPercent: invitation.residual_percent,
          token: invitation.token
        }
      });
      
      if (emailError) {
        throw emailError;
      }

      toast.success(`Invitation resent to ${invitation.email}`);
      
      // Refresh the invitations list
      fetchInvitations();
    } catch (error: any) {
      console.error('Error resending invitation:', error.message);
      toast.error('Failed to resend invitation: ' + error.message);
    }
  };
  
  const copyInviteLink = (invitation: Invitation) => {
    const inviteLink = `${window.location.origin}/invitation/accept?token=${invitation.token}&email=${encodeURIComponent(invitation.email)}`;
    navigator.clipboard.writeText(inviteLink);
    toast.success('Invitation link copied to clipboard');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        <span className="ml-2 text-lg text-gray-600">Loading invitations...</span>
      </div>
    );
  }
  
  if (invitations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Invitations</CardTitle>
          <CardDescription>No invitations have been sent yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            onClick={fetchInvitations}
            className="flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Recent Invitations</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={fetchInvitations}
          className="flex items-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Residual %</TableHead>
              <TableHead>Date Sent</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.map((invitation) => (
              <TableRow key={invitation.id} className={invitation.status === 'expired' ? 'bg-gray-50' : ''}>
                <TableCell className="font-medium">{invitation.email}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {invitation.status === 'pending' && (
                      <AlertCircle className="h-4 w-4 text-yellow-500 mr-1.5" />
                    )}
                    {invitation.status === 'accepted' && (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
                    )}
                    {invitation.status === 'expired' && (
                      <AlertCircle className="h-4 w-4 text-gray-400 mr-1.5" />
                    )}
                    <Badge className={getStatusColor(invitation.status)}>
                      {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Percent className="h-3 w-3 mr-1 text-gray-500" />
                    <span>{invitation.residual_percent}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(invitation.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <span className={isPast(new Date(invitation.expires_at)) && invitation.status === 'pending' ? 'text-red-500' : ''}>
                    {format(new Date(invitation.expires_at), "MMM d, yyyy")}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {invitation.status === "pending" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyInviteLink(invitation)}
                      className="h-8 px-2"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                  {invitation.status === "expired" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResendInvitation(invitation)}
                    >
                      Resend
                    </Button>
                  ) : invitation.status === "accepted" ? (
                    <Badge variant="outline" className="bg-gray-50">
                      {invitation.accepted_at ? format(new Date(invitation.accepted_at), "MMM d") : 'Accepted'}
                    </Badge>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

