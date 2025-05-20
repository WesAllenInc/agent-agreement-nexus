import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Trash2, ExternalLink, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAgreementAttachments, AgreementAttachment, AttachmentType } from "@/hooks/useAgreementAttachments";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface AttachmentsListProps {
  agreementId: string;
  showUploadControls?: boolean;
}

export default function AttachmentsList({ agreementId, showUploadControls = false }: AttachmentsListProps) {
  const { attachments, loading, fetchAttachments, deleteAttachment, getFilePathFromUrl } = useAgreementAttachments({ agreementId });
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isSeniorAgent = user?.role === "senior_agent";

  useEffect(() => {
    if (agreementId) {
      fetchAttachments();
    }
  }, [agreementId]);

  const getAttachmentsByType = (type: AttachmentType) => {
    return attachments.filter(attachment => attachment.type === type);
  };

  const handleDelete = async (attachment: AgreementAttachment) => {
    if (window.confirm("Are you sure you want to delete this attachment?")) {
      // Extract the file path from the URL
      const filePath = getFilePathFromUrl(attachment.file_url);
      
      if (!filePath) {
        toast.error("Could not determine file path");
        return;
      }
      
      await deleteAttachment(attachment.id, filePath);
    }
  };

  const canDelete = (attachment: AgreementAttachment) => {
    return isAdmin || (user?.id === attachment.created_by);
  };

  const renderAttachmentsList = (type: AttachmentType, title: string) => {
    const typeAttachments = getAttachmentsByType(type);
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Schedule {type}</CardTitle>
          <CardDescription>
            {type === "B" ? "Commission Schedule" : "Additional Terms"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {typeAttachments.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No Schedule {type} attachments found</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {typeAttachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center justify-between border p-3 rounded-md">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm">{attachment.file_name}</p>
                      <p className="text-xs text-muted-foreground">
                        Uploaded {formatDate(attachment.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={attachment.file_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View
                      </a>
                    </Button>
                    {canDelete(attachment) && (
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDelete(attachment)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return <div>Loading attachments...</div>;
  }

  return (
    <div className="space-y-6">
      {renderAttachmentsList("B", "Commission Schedule")}
      {renderAttachmentsList("C", "Additional Terms")}
    </div>
  );
}
