
import { useState } from "react";
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

// Sample data for demonstration
const sampleInvitations: Invitation[] = [
  {
    id: "1",
    email: "john.doe@example.com",
    token: "token1",
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    created_by: "admin-user-id",
    status: "pending",
  },
  {
    id: "2",
    email: "jane.smith@example.com",
    token: "token2",
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: "admin-user-id",
    status: "accepted",
  },
  {
    id: "3",
    email: "mark.wilson@example.com",
    token: "token3",
    expires_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: "admin-user-id",
    status: "expired",
  },
];

export default function InvitationsList() {
  const [invitations, setInvitations] = useState<Invitation[]>(sampleInvitations);

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

  const handleResendInvitation = (invitation: Invitation) => {
    // Mock resend invitation - would be replaced with actual function call
    const updatedInvitations = invitations.map((inv) =>
      inv.id === invitation.id
        ? {
            ...inv,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: "pending" as const,
          }
        : inv
    );
    
    setInvitations(updatedInvitations);
  };

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

