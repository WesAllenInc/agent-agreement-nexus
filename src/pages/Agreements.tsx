import { useState } from 'react';
import { useAgreements } from '@/hooks/useAgreements';
import { useAuth } from '@/hooks/useAuth';
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
import { Loader2, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';

export function Agreements() {
  const { user } = useAuth();
  const { agreements, isLoading, uploadAgreement, downloadAgreement } = useAgreements();
  const [selectedAgreement, setSelectedAgreement] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

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
        <h1 className="text-3xl font-bold">Agreements</h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agreements?.map((agreement) => (
                <TableRow key={agreement.id}>
                  <TableCell>{agreement.file_name}</TableCell>
                  <TableCell>
                    {format(new Date(agreement.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    {Math.round(agreement.file_size / 1024)} KB
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
            </TableBody>
          </Table>
        </Card>

        <Card className="h-[600px]">
          {selectedAgreement ? (
            <PdfViewer
              url={getSignedUrl(
                agreements?.find((a) => a.id === selectedAgreement)?.file_path || ''
              )}
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
    </div>
  );
}
