
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/auth";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { User, Users, MoreHorizontal, Mail, UserPlus, Search } from "lucide-react";
import { toast } from "sonner";

export default function UsersManagement() {
  const [filterRole, setFilterRole] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // In a real app, we would fetch from the database
      // For now, we'll use mock data
      const mockUsers: (Profile & { last_sign_in_at?: string; created_at: string })[] = [
        {
          id: "1",
          email: "admin@example.com",
          first_name: "Admin",
          last_name: "User",
          role: "admin",
          last_sign_in_at: new Date().toISOString(),
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          phone: "+1 (555) 123-4567"
        },
        {
          id: "2",
          email: "john.smith@example.com",
          first_name: "John",
          last_name: "Smith",
          role: "sales_agent",
          last_sign_in_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          phone: "+1 (555) 234-5678"
        },
        {
          id: "3",
          email: "sarah.jones@example.com",
          first_name: "Sarah",
          last_name: "Jones",
          role: "sales_agent",
          last_sign_in_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          phone: "+1 (555) 345-6789"
        },
        {
          id: "4",
          email: "michael.brown@example.com",
          first_name: "Michael",
          last_name: "Brown",
          role: "sales_agent",
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          phone: "+1 (555) 456-7890"
        },
        {
          id: "5",
          email: "emma.wilson@example.com",
          first_name: "Emma",
          last_name: "Wilson",
          role: "sales_agent",
          last_sign_in_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          phone: "+1 (555) 567-8901"
        },
      ];
      
      return mockUsers;
    }
  });

  const filteredUsers = users?.filter(user => {
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesSearch = 
      searchTerm === "" ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesRole && matchesSearch;
  });

  const handleInviteUser = (data: { email: string; role: string }) => {
    // In a real app, this would send an invitation
    toast.success(`Invitation sent to ${data.email}`);
    setIsInviteDialogOpen(false);
  };

  const handleChangeRole = (userId: string, newRole: string) => {
    // In a real app, this would update the user's role
    toast.success(`User role updated to ${newRole}`);
  };

  const handleResetPassword = (email: string) => {
    // In a real app, this would trigger a password reset
    toast.success(`Password reset email sent to ${email}`);
  };

  const handleDeactivateUser = (userId: string) => {
    // In a real app, this would deactivate the user
    toast.success(`User deactivated`);
  };

  return (
    <MainLayout isAdmin>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">User Management</h1>
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite New User</DialogTitle>
                <DialogDescription>
                  Send an invitation email to add a new user to the system.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleInviteUser({
                  email: formData.get("email") as string,
                  role: formData.get("role") as string,
                });
              }}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="user@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="role" className="text-sm font-medium">
                      Role
                    </label>
                    <Select name="role" defaultValue="sales_agent">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="sales_agent">Sales Agent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Send Invitation</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-64">
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Administrators</SelectItem>
                <SelectItem value="sales_agent">Sales Agents</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Sign In</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6} className="h-16">
                      <div className="flex space-x-2 items-center">
                        <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                          <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-destructive">
                    Error loading users. Please try again later.
                  </TableCell>
                </TableRow>
              ) : filteredUsers?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No users match your search criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.role === "admin"
                            ? "bg-purple-50 text-purple-800 border-purple-200"
                            : "bg-blue-50 text-blue-800 border-blue-200"
                        }
                      >
                        {user.role === "admin" ? "Admin" : "Sales Agent"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.last_sign_in_at
                            ? "bg-green-50 text-green-800 border-green-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }
                      >
                        {user.last_sign_in_at ? "Active" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.last_sign_in_at
                        ? format(new Date(user.last_sign_in_at), "PPp")
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      {format(new Date(user.created_at), "PPp")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              if (user.role === "admin") {
                                handleChangeRole(user.id, "sales_agent");
                              } else {
                                handleChangeRole(user.id, "admin");
                              }
                            }}
                          >
                            <Users className="mr-2 h-4 w-4" />
                            {user.role === "admin"
                              ? "Change to Sales Agent"
                              : "Change to Admin"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleResetPassword(user.email)}>
                            <Mail className="mr-2 h-4 w-4" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeactivateUser(user.id)}
                          >
                            Deactivate User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
