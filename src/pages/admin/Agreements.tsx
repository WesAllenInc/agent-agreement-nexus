
import { useState } from "react";
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

interface AgreementData {
  id: string;
  agent_name: string;
  business_name: string;
  email: string;
  status: "draft" | "submitted" | "signed";
  created_at: string;
  updated_at: string;
}

// Sample data
const sampleAgreements: AgreementData[] = [
  {
    id: "agr-001",
    agent_name: "John Smith",
    business_name: "Smith Enterprises LLC",
    email: "john.smith@example.com",
    status: "signed",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "agr-002",
    agent_name: "Maria Garcia",
    business_name: "Garcia Solutions",
    email: "maria.garcia@example.com",
    status: "signed",
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "agr-003",
    agent_name: "William Chen",
    business_name: "Chen Consulting",
    email: "william.chen@example.com",
    status: "submitted",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "agr-004",
    agent_name: "Samantha Lee",
    business_name: "Lee Trading Co",
    email: "samantha.lee@example.com",
    status: "draft",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "agr-005",
    agent_name: "Robert Johnson",
    business_name: "Johnson Industries Inc",
    email: "robert.johnson@example.com",
    status: "signed",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function Agreements() {
  const [agreements, setAgreements] = useState<AgreementData[]>(sampleAgreements);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredAgreements = agreements.filter((agreement) => {
    const matchesStatus = statusFilter === "all" || agreement.status === statusFilter;
    const matchesSearch =
      agreement.agent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Draft
          </Badge>
        );
      case "submitted":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Submitted
          </Badge>
        );
      case "signed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Signed
          </Badge>
        );
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <MainLayout isAdmin>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Agreements</h1>
          {/* Add agreement button would go here in a real app */}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-64">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="signed">Signed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Input
              placeholder="Search by name, business, or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Business Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgreements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No agreements found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAgreements.map((agreement) => (
                  <TableRow key={agreement.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{agreement.agent_name}</div>
                        <div className="text-sm text-gray-500">{agreement.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{agreement.business_name}</TableCell>
                    <TableCell>{getStatusBadge(agreement.status)}</TableCell>
                    <TableCell>{format(new Date(agreement.created_at), "MMM d, yyyy")}</TableCell>
                    <TableCell>{format(new Date(agreement.updated_at), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
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
