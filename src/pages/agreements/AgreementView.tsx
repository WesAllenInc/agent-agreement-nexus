import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PdfViewer } from '@/components/PdfViewer';
import SignatureCanvas from '@/components/agreement/SignatureCanvas';
import { useAgreement } from '@/hooks/useAgreement';
import { useAgreementSignature } from '@/hooks/useAgreementSignature';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import AgreementAttachments from '@/components/agreements/AgreementAttachments';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import AuthErrorHandler from '@/components/auth/AuthErrorHandler';

export default function AgreementView() {
  // Show auth errors if any
  return (
    <>
      <AuthErrorHandler />
      <AgreementViewContent />
    </>
  );
}

function AgreementViewContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { agreement, loading: agreementLoading, error, fileUrl, updateStatus } = useAgreement(id);
  const { signature, loading: signatureLoading, fetchSignature, saveSignature, getSignatureUrl } = useAgreementSignature(id || '');
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('document');

  useEffect(() => {
    if (!user) {
      toast.error('You must be logged in to view agreements');
      navigate('/login');
      return;
    }

    // Mark agreement as viewed if it's not already signed
    if (agreement && agreement.status === 'active') {
      updateStatus('viewed');
    }
  }, [user, agreement, navigate, updateStatus]);

  useEffect(() => {
    if (id) {
      fetchSignature();
    }
  }, [id, fetchSignature]);

  useEffect(() => {
    const loadSignatureUrl = async () => {
      if (signature?.signature_path) {
        const url = await getSignatureUrl(signature.signature_path);
        setSignatureUrl(url);
      }
    };

    loadSignatureUrl();
  }, [signature, getSignatureUrl]);

  const handleSaveSignature = async (signatureData: string) => {
    if (!id) return;
    
    const result = await saveSignature(signatureData);
    if (result) {
      setActiveTab('document');
      toast.success('Signature saved successfully');
    }
  };

  if (agreementLoading || signatureLoading) {
    return <Loading text="Loading agreement..." size={32} fullPage />
  }

  if (error || !agreement) {
    return (
      <ErrorMessage
        title="Agreement Not Found"
        message={error || 'The requested agreement could not be found'}
        fullPage
        action={
          <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
        }
      />
    );
  }

  const isSigned = agreement.status === 'signed' || !!signature;
  const formattedDate = format(new Date(agreement.created_at), 'PPP');

  return (
    <div className="container max-w-5xl py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{agreement.file_name}</h1>
          <p className="text-muted-foreground">Uploaded on {formattedDate}</p>
        </div>
        <div className="flex items-center gap-2">
          {isSigned ? (
            <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Signed</span>
            </div>
          ) : (
            <Button onClick={() => setActiveTab('sign')} variant="default">
              Sign Agreement
            </Button>
          )}
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="document">Document</TabsTrigger>
          <TabsTrigger value="sign" disabled={isSigned}>Sign</TabsTrigger>
          {isSigned && <TabsTrigger value="signature">Signature</TabsTrigger>}
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
        </TabsList>

        <TabsContent value="document" className="min-h-[70vh]">
          {fileUrl && (
            <PdfViewer
              url={fileUrl}
              onDownload={() => window.open(fileUrl, '_blank')}
            />
          )}
        </TabsContent>

        <TabsContent value="sign">
          <Card>
            <CardHeader>
              <CardTitle>Sign Agreement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-muted-foreground">
                By signing this document, you acknowledge that you have read and agree to all terms and conditions outlined in the agreement.
              </p>
              <Separator className="my-6" />
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Your Signature</h3>
                <SignatureCanvas onSave={handleSaveSignature} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('document')}>
                Back to Document
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {isSigned && (
          <TabsContent value="signature">
            <Card>
              <CardHeader>
                <CardTitle>Signature Record</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Signed By</h3>
                    <p>{user?.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Date Signed</h3>
                    <p>{signature ? format(new Date(signature.signed_at), 'PPP') : 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Signature</h3>
                    {signatureUrl ? (
                      <div className="border rounded-md p-4 mt-2 bg-white">
                        <img 
                          src={signatureUrl} 
                          alt="Signature" 
                          className="max-h-24"
                        />
                      </div>
                    ) : (
                      <p>Signature image not available</p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => setActiveTab('document')}>
                  Back to Document
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}
        
        <TabsContent value="attachments">
          <AgreementAttachments 
            agreementId={id || ''} 
            showUploadControls={isSigned} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
