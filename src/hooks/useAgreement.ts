import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Agreement {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useAgreement(agreementId: string | undefined) {
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!agreementId) {
      setLoading(false);
      setError('No agreement ID provided');
      return;
    }

    const fetchAgreement = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch agreement data
        const { data, error: fetchError } = await supabase
          .from('agreements')
          .select('*')
          .eq('id', agreementId)
          .single();

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        if (!data) {
          throw new Error('Agreement not found');
        }

        setAgreement(data);

        // Get signed URL for the file
        const { data: urlData, error: urlError } = await supabase.storage
          .from('agreements')
          .createSignedUrl(data.file_path, 60 * 60); // 1 hour expiry

        if (urlError) {
          throw new Error(`Failed to get file URL: ${urlError.message}`);
        }

        setFileUrl(urlData.signedUrl);
      } catch (err: any) {
        console.error('Error fetching agreement:', err);
        setError(err.message || 'Failed to load agreement');
        toast.error(`Error: ${err.message || 'Failed to load agreement'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAgreement();
  }, [agreementId]);

  // Update agreement status (e.g., from 'active' to 'viewed')
  const updateStatus = async (status: string) => {
    if (!agreementId || !agreement) return;

    try {
      const { error } = await supabase
        .from('agreements')
        .update({ status })
        .eq('id', agreementId);

      if (error) throw error;

      setAgreement(prev => prev ? { ...prev, status } : null);
      return true;
    } catch (err: any) {
      console.error('Error updating agreement status:', err);
      return false;
    }
  };

  return {
    agreement,
    loading,
    error,
    fileUrl,
    updateStatus
  };
}
