import { useState } from 'react';
import { useAgreements } from '../hooks/useAgreements';
import { PdfViewer } from '../components/PdfViewer';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Loader2 } from 'lucide-react';
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { supabase } from '../integrations/supabase/client';
import { AdminAgreementSearch, AdminAgreementFilters } from '../components/AdminAgreementSearch';
import { Agreement } from '../types/agreement';
import { Checkbox } from '../components/ui/checkbox';
import { useToast } from '../components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';

export function AdminAgreements() {
  const { agreements, isLoading } = useAgreements(); // No userId means fetch all
  const [selectedAgreement, setSelectedAgreement] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { toast } = useToast();
  const [filters, setFilters] = useState<AdminAgreementFilters>({
    searchTerm: '',
    status: 'all',
    dateFrom: null,
    dateTo: null,
    sortField: 'created_at',
    sortDirection: 'desc',
  });

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      status: 'all',
      dateFrom: null,
      dateTo: null,
      sortField: 'created_at',
      sortDirection: 'desc',
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredAgreements?.map(a => a.id) || []);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkArchive = async () => {
    try {
      const { error } = await supabase
        .from('agreements')
        .update({ status: 'archived' })
        .in('id', selectedIds);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `${selectedIds.length} agreements archived`,
      });
      setSelectedIds([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to archive agreements',
        variant: 'destructive',
      });
    }
  };

  const handleBulkDelete = async (ids?: string[]) => {
    const idsToDelete = ids || selectedIds;
    try {
      // First delete from storage
      for (const id of idsToDelete) {
        const agreement = agreements?.find(a => a.id === id);
        if (agreement) {
          const { error: storageError } = await supabase.storage
            .from('agreements')
            .remove([agreement.file_path]);
          if (storageError) throw storageError;
        }
      }

      // Then delete from database
      const { error: dbError } = await supabase
        .from('agreements')
        .delete()
        .in('id', idsToDelete);

      if (dbError) throw dbError;

      toast({
        title: 'Success',
        description: `${idsToDelete.length} agreements deleted`,
      });
      setSelectedIds([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete agreements',
        variant: 'destructive',
      });
    }
  };

  const filteredAgreements = agreements?.filter((agreement: Agreement) => {
    // Text search
    const matchesSearch = agreement.file_name
      .toLowerCase()
      .includes(filters.searchTerm.toLowerCase());

    // Status filter
    const matchesStatus =
      filters.status === 'all' || agreement.status === filters.status;

    // Date range filter
    let matchesDate = true;
    if (filters.dateFrom || filters.dateTo) {
      const agreementDate = new Date(agreement.created_at);
      
      if (filters.dateFrom && filters.dateTo) {
        matchesDate = isWithinInterval(agreementDate, {
          start: startOfDay(filters.dateFrom),
          end: endOfDay(filters.dateTo),
        });
      } else if (filters.dateFrom) {
        matchesDate = agreementDate >= startOfDay(filters.dateFrom);
      } else if (filters.dateTo) {
        matchesDate = agreementDate <= endOfDay(filters.dateTo);
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  })?.sort((a, b) => {
    const direction = filters.sortDirection === 'asc' ? 1 : -1;
    
    switch (filters.sortField) {
      case 'file_name':
        return direction * a.file_name.localeCompare(b.file_name);
      case 'file_size':
        return direction * (a.file_size - b.file_size);
      case 'status':
        return direction * a.status.localeCompare(b.status);
      case 'created_at':
      default:
        return direction * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }
  });

  const getSignedUrl = async (filePath: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage
        .from('agreements')
        .createSignedUrl(filePath, 3600); // 1 hour expiry
      
      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error('Error getting signed URL:', error);
      return null;
    }
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

      <Card className="p-4 space-y-6">
        <AdminAgreementSearch
          filters={filters}
          onFiltersChange={setFilters}
          onReset={resetFilters}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          totalCount={filteredAgreements?.length || 0}
          onBulkArchive={handleBulkArchive}
          onBulkDelete={handleBulkDelete}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30px]"></TableHead>
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
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(agreement.id)}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectOne(agreement.id);
                        }}
                      />
                    </TableCell>
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
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAgreement(agreement.id)}
                        >
                          View
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                            >
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Agreement</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this agreement? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleBulkDelete([agreement.id])}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAgreements?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      No agreements found matching your filters
                    </TableCell>
                  </TableRow>
                )}
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

