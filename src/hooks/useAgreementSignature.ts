import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useEmailNotifications } from '@/hooks/useEmailNotifications';

interface AgreementSignature {
  id: string;
  agreement_id: string;
  user_id: string;
  signature_path: string;
  signed_at: string;
}

export function useAgreementSignature(agreementId: string) {
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState<AgreementSignature | null>(null);
  const { user } = useAuth();
  const { sendAgreementSignedNotification } = useEmailNotifications();

  const fetchSignature = async () => {
    if (!user) return null;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('agreement_signatures')
        .select('*')
        .eq('agreement_id', agreementId)
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
      setSignature(data);
      return data;
    } catch (error: any) {
      console.error('Error fetching signature:', error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const saveSignature = async (signatureData: string) => {
    if (!user) {
      toast.error('You must be logged in to sign agreements');
      return null;
    }
    
    try {
      setLoading(true);
      
      // 1. Upload signature image to storage
      const fileName = `${user.id}/signatures/${agreementId}_${Date.now()}.png`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('agreements')
        .upload(fileName, base64ToBlob(signatureData), {
          contentType: 'image/png',
          upsert: true
        });
      
      if (uploadError) throw uploadError;
      
      const signaturePath = uploadData.path;
      
      // 2. Check if signature already exists
      const { data: existingSignature } = await supabase
        .from('agreement_signatures')
        .select('id')
        .eq('agreement_id', agreementId)
        .eq('user_id', user.id)
        .single();
      
      let result;
      
      if (existingSignature) {
        // 3a. Update existing signature
        const { data, error } = await supabase
          .from('agreement_signatures')
          .update({
            signature_path: signaturePath,
            signed_at: new Date().toISOString()
          })
          .eq('id', existingSignature.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // 3b. Insert new signature
        const { data, error } = await supabase
          .from('agreement_signatures')
          .insert({
            agreement_id: agreementId,
            user_id: user.id,
            signature_path: signaturePath
          })
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }
      
      // 4. Update agreement status to 'signed' if needed
      await supabase
        .from('agreements')
        .update({ status: 'signed' })
        .eq('id', agreementId);
      
      // 5. Get agreement details to include in notification
      const { data: agreementData } = await supabase
        .from('agreements')
        .select('*')
        .eq('id', agreementId)
        .single();
        
      // 6. Get user details
      const { data: userData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      // 7. Get admin emails to notify
      const { data: adminUsers } = await supabase
        .from('profiles')
        .select('email')
        .eq('role', 'admin');
        
      // 8. Send email notification to admins
      if (adminUsers && adminUsers.length > 0 && agreementData && userData) {
        const adminEmails = adminUsers.map(admin => admin.email);
        const viewUrl = `${window.location.origin}/admin/agreements/${agreementId}`;
        
        // Send to first admin, cc the rest
        const primaryAdmin = adminEmails.shift();
        if (primaryAdmin) {
          try {
            await sendAgreementSignedNotification(
              primaryAdmin,
              userData.full_name || user.email || 'Agent',
              agreementData.file_name || 'Agreement',
              new Date().toLocaleDateString(),
              viewUrl,
              adminEmails // cc other admins
            );
          } catch (error) {
            console.error('Failed to send agreement signed notification:', error);
            // Non-blocking error - we don't want to fail the signature process if email fails
          }
        }
      }
      
      setSignature(result);
      toast.success('Agreement signed successfully');
      return result;
    } catch (error: any) {
      console.error('Error saving signature:', error.message);
      toast.error(`Failed to save signature: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert base64 to Blob
  const base64ToBlob = (base64: string) => {
    const parts = base64.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    
    return new Blob([uInt8Array], { type: contentType });
  };

  // Check if signature exists for this agreement and user
  const signatureExists = async () => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('agreement_signatures')
        .select('id')
        .eq('agreement_id', agreementId)
        .eq('user_id', user.id)
        .single();
      
      if (error) return false;
      return !!data;
    } catch (error: any) {
      console.error('Error checking signature existence:', error.message);
      return false;
    }
  };

  // Get the signature URL
  const getSignatureUrl = async (path?: string) => {
    try {
      // If no path provided, fetch the signature first
      if (!path && !signature) {
        const signatureData = await fetchSignature();
        if (!signatureData) return null;
        path = signatureData.signature_path;
      } else if (!path && signature) {
        path = signature.signature_path;
      }
      
      if (!path) return null;
      
      const { data, error } = await supabase.storage
        .from('agreements')
        .createSignedUrl(path, 60 * 60); // 1 hour expiry
      
      if (error) throw error;
      
      return data.signedUrl;
    } catch (error: any) {
      console.error('Error getting signature URL:', error.message);
      return null;
    }
  };

  return {
    signature,
    isLoading: loading,
    fetchSignature,
    saveSignature,
    getSignatureUrl,
    signatureExists
  };
}
