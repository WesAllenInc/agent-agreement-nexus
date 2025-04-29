import { useState } from 'react';
import { useAgreements } from '@/hooks/useAgreements';
import { PdfViewer } from '@/components/PdfViewer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Search } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';

export function AdminAgreements() {
  const { agreements, isLoading } = useAgreements(); // No userId means fetch all
  const [selectedAgreement, setSelectedAgreement] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredAgreements = agreements?.filter((agreement) => {
    const matchesSearch = agreement.file_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || agreement.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getSignedUrl = async (filePath: string) => {
    const { data: { signedUrl } } = await supabase.storage
      .from('agreements')
      .createSignedUrl(filePath, 3600); // 1 hour expiry
    return signedUrl;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin - All Agreements</h1>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agreements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={filterStatus}
            onValueChange={setFilterStatus}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgreements?.map((agreement) => (
                  <TableRow key={agreement.id}>
                    <TableCell className="font-mono">
                      {agreement.user_id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>{agreement.file_name}</TableCell>
                    <TableCell>
                      {format(new Date(agreement.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          agreement.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {agreement.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAgreement(agreement.id)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Card className="h-[600px]">
            {selectedAgreement ? (
              <PdfViewer
                url={getSignedUrl(
                  agreements?.find((a) => a.id === selectedAgreement)?.file_path || ''
                )}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select an agreement to view
              </div>
            )}
          </Card>
        </div>
      </Card>
    </div>
  );
}
