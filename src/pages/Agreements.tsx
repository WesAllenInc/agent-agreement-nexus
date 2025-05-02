import { useState, useEffect } from 'react';
import { useAgreements } from '../hooks/useAgreements';
import { useAuth } from '../hooks/useAuth';
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
import { Input } from '../components/ui/input';
import { Loader2, Upload, FileCheck } from 'lucide-react';
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { supabase } from '../integrations/supabase/client';
import { AgreementSearch, AgreementSearchFilters } from '../components/AgreementSearch';
import { Agreement } from '../types/agreement';
import { ExecuteAgreement } from '../components/ExecuteAgreement';
import { Badge } from '../components/ui/badge';

export function Agreements() {
  const { user } = useAuth();
  const { agreements, isLoading, uploadAgreement, executeAgreement, downloadAgreement } = useAgreements(user?.id);
  const [selectedAgreement, setSelectedAgreement] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [filters, setFilters] = useState<AgreementSearchFilters>({
    searchTerm: '',
    status: 'all',
    dateFrom: null,
    dateTo: null,
  });

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      status: 'all',
      dateFrom: null,
      dateTo: null,
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setUploading(true);
      await uploadAgreement.mutateAsync({ file, userId: user.id });
    } finally {
      setUploading(false);
    }
  };

  // Update signed URL when selected agreement changes
  useEffect(() => {
    if (selectedAgreement) {
      const agreement = agreements?.find(a => a.id === selectedAgreement);
      if (agreement) {
        getSignedUrl(agreement.file_path).then(url => setSignedUrl(url));
      }
    } else {
      setSignedUrl(null);
    }
  }, [selectedAgreement, agreements]);

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Active</Badge>;
      case 'executed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Executed</Badge>;
      case 'archived':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
        <h1 className="text-3xl font-bold">My Agreements</h1>
        <Button asChild>
          <label className="cursor-pointer">
            <Input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Upload Agreement
          </label>
        </Button>
      </div>

      <Card className="p-4 space-y-6">
        <AgreementSearch
          filters={filters}
          onFiltersChange={setFilters}
          onReset={resetFilters}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgreements?.map((agreement) => (
                  <TableRow key={agreement.id}>
                    <TableCell>{agreement.file_name}</TableCell>
                    <TableCell>
                      {format(new Date(agreement.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(agreement.status)}
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
                        
                        {agreement.status !== 'executed' && (
                          <ExecuteAgreement
                            agreementId={agreement.id}
                            agreementName={agreement.file_name}
                            onExecute={(params) => executeAgreement.mutate(params)}
                            isExecuting={executeAgreement.isPending}
                          />
                        )}
                        
                        {agreement.status === 'executed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <FileCheck className="h-4 w-4" />
                            Executed
                          </Button>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadAgreement(agreement)}
                        >
                          Download
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAgreements?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No agreements found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>

          <Card className="h-[600px]">
            {selectedAgreement ? (
              <PdfViewer
                url={signedUrl || ''}
                onDownload={() => {
                  const agreement = agreements?.find(
                    (a) => a.id === selectedAgreement
                  );
                  if (agreement) {
                    downloadAgreement(agreement);
                  }
                }}
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
