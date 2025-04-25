
import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

type AgentActivity = {
  id: string;
  name: string;
  email: string;
  lastActive: string;
  status: 'online' | 'offline';
  agreements: number;
};

export default function AgentActivityDashboard() {
  const [view, setView] = useState("active"); // active, all
  
  const { data: agents, isLoading } = useQuery({
    queryKey: ['agent-activity', view],
    queryFn: async () => {
      // In a real application, this would be a real API call
      // For now, we'll mock the data
      const mockAgents: AgentActivity[] = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@example.com',
          lastActive: new Date().toISOString(),
          status: 'online',
          agreements: 5,
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@example.com',
          lastActive: new Date(Date.now() - 3600000).toISOString(),
          status: 'offline',
          agreements: 3,
        },
        {
          id: '3',
          name: 'Michael Brown',
          email: 'michael.brown@example.com',
          lastActive: new Date(Date.now() - 86400000).toISOString(),
          status: 'offline',
          agreements: 7,
        },
        {
          id: '4', 
          name: 'Emily Davis',
          email: 'emily.davis@example.com',
          lastActive: new Date(Date.now() - 172800000).toISOString(),
          status: 'offline',
          agreements: 2,
        },
        {
          id: '5',
          name: 'Robert Wilson',
          email: 'robert.wilson@example.com',
          lastActive: new Date(Date.now() - 43200000).toISOString(),
          status: 'offline',
          agreements: 4,
        },
      ];
      
      if (view === 'active') {
        return mockAgents.filter(agent => 
          new Date(agent.lastActive).getTime() > Date.now() - 86400000); // Active in last 24h
      }
      
      return mockAgents;
    }
  });

  const getStatusBadge = (status: 'online' | 'offline', lastActiveDate: string) => {
    if (status === 'online') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Online</span>
    }
    
    const hoursSinceActive = Math.floor((Date.now() - new Date(lastActiveDate).getTime()) / 3600000);
    
    if (hoursSinceActive < 24) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        {hoursSinceActive}h ago
      </span>
    }
    
    const daysSinceActive = Math.floor(hoursSinceActive / 24);
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      {daysSinceActive}d ago
    </span>
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Agent Activity</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant={view === 'active' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setView('active')}
          >
            Active
          </Button>
          <Button 
            variant={view === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setView('all')}
          >
            All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Agreements</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                        <div className="h-3 bg-muted rounded w-32 animate-pulse" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-muted rounded w-16 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-4 bg-muted rounded w-8 ml-auto animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : agents?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    No agent activity found
                  </TableCell>
                </TableRow>
              ) : (
                agents?.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell>
                      <div className="font-medium">{agent.name}</div>
                      <div className="text-sm text-muted-foreground">{agent.email}</div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(agent.status, agent.lastActive)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(agent.lastActive), 'PPp')}
                    </TableCell>
                    <TableCell className="text-right">
                      {agent.agreements}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
