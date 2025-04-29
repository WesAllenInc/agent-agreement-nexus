import { useState } from 'react';
import { useAgreements } from '../hooks/useAgreements';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Loader2, Upload } from 'lucide-react';
import { PdfViewer } from '../components/PdfViewer';
import { supabase } from '../integrations/supabase/client';

export function TestAgreementUpload() {
  const { user } = useAuth();
  const { agreements, isLoading, uploadAgreement } = useAgreements();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [viewUrl, setViewUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    try {
      setUploading(true);
      await uploadAgreement.mutateAsync({ file: selectedFile, userId: user.id });
      setSelectedFile(null);
      // Reset file input
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) input.value = '';
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const viewAgreement = async (filePath: string) => {
    try {
      const { data: { signedUrl } } = await supabase.storage
        .from('agreements')
        .createSignedUrl(filePath, 3600); // 1 hour expiry
      if (signedUrl) {
        setViewUrl(signedUrl);
      }
    } catch (error) {
      console.error('Error getting signed URL:', error);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Test Agreement Upload</h2>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="application/pdf"
              onChange={handleFileSelect}
              disabled={uploading}
            />
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="font-semibold">Uploaded Agreements:</h3>
              {agreements?.map((agreement) => (
                <div
                  key={agreement.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <span>{agreement.file_name}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewAgreement(agreement.file_path)}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {viewUrl && (
        <Card className="h-[600px]">
          <PdfViewer url={viewUrl} />
        </Card>
      )}
    </div>
  );
}
