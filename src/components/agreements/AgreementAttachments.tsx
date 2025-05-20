import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAgreementAttachments, AttachmentType } from "@/hooks/useAgreementAttachments";
import PdfUploader from "./PdfUploader";
import AttachmentsList from "./AttachmentsList";
import { useAuth } from "@/hooks/useAuth";

interface AgreementAttachmentsProps {
  agreementId: string;
  showUploadControls?: boolean;
}

export default function AgreementAttachments({ 
  agreementId, 
  showUploadControls = false 
}: AgreementAttachmentsProps) {
  const { 
    attachments, 
    loading, 
    uploading, 
    fetchAttachments, 
    uploadAttachment 
  } = useAgreementAttachments({ agreementId });
  const { user } = useAuth();
  
  // Check if user is admin or owner of the agreement
  const canUpload = showUploadControls && user;

  useEffect(() => {
    if (agreementId) {
      fetchAttachments();
    }
  }, [agreementId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agreement Attachments</CardTitle>
        <CardDescription>
          View and manage Schedule B (Commission Schedule) and Schedule C (Additional Terms)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="view" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="view">View Attachments</TabsTrigger>
            {canUpload && <TabsTrigger value="upload">Upload Attachments</TabsTrigger>}
          </TabsList>
          <TabsContent value="view" className="space-y-4 pt-4">
            <AttachmentsList agreementId={agreementId} />
          </TabsContent>
          {canUpload && (
            <TabsContent value="upload" className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Schedule B</CardTitle>
                  <CardDescription>Upload Commission Schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <PdfUploader
                    onUpload={uploadAttachment}
                    type="B"
                    isUploading={uploading}
                    label="Upload Schedule B"
                    description="Upload the commission schedule for this agreement (PDF only, max 10MB)"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Schedule C</CardTitle>
                  <CardDescription>Upload Additional Terms</CardDescription>
                </CardHeader>
                <CardContent>
                  <PdfUploader
                    onUpload={uploadAttachment}
                    type="C"
                    isUploading={uploading}
                    label="Upload Schedule C"
                    description="Upload additional terms for this agreement (PDF only, max 10MB)"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
