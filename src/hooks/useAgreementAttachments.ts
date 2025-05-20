import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

export type AttachmentType = "B" | "C";

export interface AgreementAttachment {
  id: string;
  agreement_id: string;
  type: AttachmentType;
  file_url: string;
  file_name: string;
  file_size: number;
  content_type: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface UseAgreementAttachmentsProps {
  agreementId: string;
}

export const useAgreementAttachments = ({ agreementId }: UseAgreementAttachmentsProps) => {
  const [attachments, setAttachments] = useState<AgreementAttachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  // Fetch attachments for a specific agreement
  const fetchAttachments = async () => {
    if (!agreementId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("agreement_attachments")
        .select("*")
        .eq("agreement_id", agreementId)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setAttachments(data || []);
    } catch (error: any) {
      console.error("Error fetching attachments:", error.message);
      toast.error("Failed to load attachments");
    } finally {
      setLoading(false);
    }
  };

  // Upload a file to Supabase Storage and create an attachment record
  const uploadAttachment = async (file: File, type: AttachmentType) => {
    if (!agreementId || !user) {
      toast.error("Missing agreement ID or user");
      return null;
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return null;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return null;
    }

    setUploading(true);
    try {
      // Create a unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${agreementId}/${type}/${fileName}`;

      // Upload file to Supabase Storage
      const { data: fileData, error: uploadError } = await supabase.storage
        .from("attachments")
        .upload(filePath, file, {
          cacheControl: "3600",
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL for the file
      const { data: urlData } = await supabase.storage
        .from("attachments")
        .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year expiry

      if (!urlData || !urlData.signedUrl) {
        throw new Error("Failed to generate file URL");
      }

      // Create a record in the agreement_attachments table
      const { data: attachmentData, error: attachmentError } = await supabase
        .from("agreement_attachments")
        .insert({
          agreement_id: agreementId,
          type,
          file_url: urlData.signedUrl,
          file_name: file.name,
          file_size: file.size,
          content_type: file.type,
          created_by: user.id,
        })
        .select()
        .single();

      if (attachmentError) {
        // If there's an error creating the record, delete the uploaded file
        await supabase.storage.from("attachments").remove([filePath]);
        throw attachmentError;
      }

      // Refresh the attachments list
      await fetchAttachments();

      toast.success(`Schedule ${type} uploaded successfully`);
      return attachmentData;
    } catch (error: any) {
      console.error("Error uploading attachment:", error.message);
      toast.error(error.message || "Failed to upload attachment");
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Extract file path from URL
  const getFilePathFromUrl = (url: string): string => {
    try {
      const parsedUrl = new URL(url);
      const pathParts = parsedUrl.pathname.split('/');
      const bucketIndex = pathParts.findIndex(part => part === 'attachments');
      
      if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
        return pathParts.slice(bucketIndex + 1).join('/');
      }
      return '';
    } catch (error) {
      console.error('Error parsing URL:', error);
      return '';
    }
  };

  // Delete an attachment
  const deleteAttachment = async (attachmentId: string, filePath: string) => {
    if (!attachmentId) return;

    try {
      // Delete the record from the agreement_attachments table
      const { error: deleteRecordError } = await supabase
        .from("agreement_attachments")
        .delete()
        .eq("id", attachmentId);

      if (deleteRecordError) {
        throw deleteRecordError;
      }

      // Delete the file from Supabase Storage
      const { error: deleteFileError } = await supabase.storage
        .from("attachments")
        .remove([filePath]);

      if (deleteFileError) {
        console.error("Error deleting file:", deleteFileError.message);
      }

      // Refresh the attachments list
      await fetchAttachments();

      toast.success("Attachment deleted successfully");
    } catch (error: any) {
      console.error("Error deleting attachment:", error.message);
      toast.error(error.message || "Failed to delete attachment");
    }
  };

  // Get the latest attachment of a specific type
  const getLatestAttachment = (type: AttachmentType) => {
    return attachments.find((attachment) => attachment.type === type);
  };

  return {
    attachments,
    loading,
    uploading,
    fetchAttachments,
    uploadAttachment,
    deleteAttachment,
    getLatestAttachment,
    getFilePathFromUrl,
  };
};
