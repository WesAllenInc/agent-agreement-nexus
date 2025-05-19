
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
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
import { Invitation } from "@/types";
import { format } from "date-fns";



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

      setInvitations(data || []);
    } catch (error: any) {
      console.error('Error fetching invitations:', error.message);
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
      }

      // Refresh the invitations list
      fetchInvitations();
    } catch (error: any) {
      console.error('Error resending invitation:', error.message);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading invitations...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Sent</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.map((invitation) => (
            <TableRow key={invitation.id}>
              <TableCell>{invitation.email}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(invitation.status)}>
                  {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(invitation.created_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                {format(new Date(invitation.expires_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-right">
                {invitation.status === "pending" || invitation.status === "expired" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResendInvitation(invitation)}
                    disabled={invitation.status === "pending"}
                  >
                    {invitation.status === "expired" ? "Resend" : "Pending"}
                  </Button>
                ) : (
                  <Badge variant="outline" className="bg-gray-50">
                    Accepted
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

