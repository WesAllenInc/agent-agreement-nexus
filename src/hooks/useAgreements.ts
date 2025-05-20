import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Agreement, UploadAgreementParams } from '@/types/agreement';
import { useState } from 'react';

export function useAgreements(userId?: string) {
  const [error, setError] = useState<Error | null>(null);
  const queryClient = useQueryClient();

  const { data: agreements, isLoading, refetch } = useQuery({
    queryKey: ['agreements', userId],
    queryFn: async () => {
      try {
        setError(null);
        let query = supabase.from('agreements').select('*');
        if (userId) {
          query = query.eq('user_id', userId);
        }
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        return data as Agreement[];
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        console.error('Error fetching agreements:', error);
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const resetError = () => {
    setError(null);
  };

  const uploadAgreement = useMutation({
    mutationFn: async ({ file, userId }: UploadAgreementParams) => {
      try {
        setError(null);
        const filePath = `${userId}/${file.name}`;
        
        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('agreements')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;

        // Create database record
        const { error: dbError } = await supabase.from('agreements').insert({
          user_id: userId,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          status: 'active' as const,
        });

        if (dbError) throw dbError;
        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        console.error('Error uploading agreement:', error);
        throw error;
      }
    },
    retry: 0,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agreements'] });
      toast.success('Agreement uploaded successfully');
    },
    onError: (error: Error) => {
      setError(error);
      toast.error(`Error uploading agreement: ${error.message}`);
    },
  });

  const downloadAgreement = async (agreement: Agreement) => {
    try {
      setError(null);
      const { data, error } = await supabase.storage
        .from('agreements')
        .download(agreement.file_path);
      
      if (error) throw error;

      // Create blob URL and trigger download
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = agreement.file_name;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Agreement downloaded successfully');
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('Error downloading agreement:', error);
      toast.error(`Error downloading agreement: ${error.message}`);
    }
  };

  return {
    agreements,
    isLoading,
    error,
    resetError,
    refetch,
    uploadAgreement,
    downloadAgreement,
  };
}
