import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, FileUp, Loader2, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AttachmentType } from "@/hooks/useAgreementAttachments";

interface PdfUploaderProps {
  onUpload: (file: File, type: AttachmentType) => Promise<any>;
  type: AttachmentType;
  isUploading: boolean;
  label?: string;
  description?: string;
}

export default function PdfUploader({
  onUpload,
  type,
  isUploading,
  label = "Upload PDF",
  description = "Upload a PDF file",
}: PdfUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    try {
      await onUpload(selectedFile, type);
      // Reset the form after successful upload
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`file-upload-${type}`}>{label}</Label>
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <div className="grid w-full gap-1.5">
              <Input
                ref={fileInputRef}
                id={`file-upload-${type}`}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="cursor-pointer"
                disabled={isUploading}
              />
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="flex-shrink-0"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <FileUp className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {selectedFile && (
        <div className="flex items-center gap-2 rounded-md border p-3 bg-muted/50">
          <FileText className="h-5 w-5 text-blue-600" />
          <div className="flex-1 truncate">
            <p className="text-sm font-medium">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
