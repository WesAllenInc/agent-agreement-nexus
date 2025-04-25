
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User, UserCheck, UserX, MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const mockAgents = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    status: "active",
    agreements: 3,
    lastActive: "2023-05-15T10:30:00Z"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    status: "pending",
    agreements: 0,
    lastActive: null
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    status: "inactive",
    agreements: 1,
    lastActive: "2023-02-10T14:45:00Z"
  }
];

const Agents = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <UserCheck className="h-4 w-4 text-green-500" />;
      case "pending":
        return <User className="h-4 w-4 text-amber-500" />;
      case "inactive":
        return <UserX className="h-4 w-4 text-gray-500" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <MainLayout isAdmin>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sales Agents</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Manage your sales agents and their agreements
            </p>
          </div>
          <Button>Invite Agent</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Agreements</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAgents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell>
                      <div className="font-medium">{agent.name}</div>
                    </TableCell>
                    <TableCell>{agent.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(agent.status)}
                        <span className="capitalize">{agent.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>{agent.agreements}</TableCell>
                    <TableCell>
                      {agent.lastActive 
                        ? new Date(agent.lastActive).toLocaleDateString() 
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Send Message</DropdownMenuItem>
                          {agent.status !== "active" && (
                            <DropdownMenuItem>Activate</DropdownMenuItem>
                          )}
                          {agent.status !== "inactive" && (
                            <DropdownMenuItem>Deactivate</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Agents;
