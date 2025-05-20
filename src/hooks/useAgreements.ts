import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Agreement, UploadAgreementParams } from '@/types/agreement';
import { useState, useCallback, useEffect } from 'react';
import { captureException } from '@/utils/errorTracking';

// Function to fetch agreements - extracted for prefetching
export const fetchAgreements = async (userId?: string): Promise<Agreement[]> => {
  try {
    let query = supabase.from('agreements').select('*');
    if (userId) {
      query = query.eq('user_id', userId);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data as Agreement[];
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Error fetching agreements:', error);
    captureException(error, { context: 'fetchAgreements', userId });
    throw error;
  }
};

// Function to fetch a single agreement by ID
export const fetchAgreementById = async (agreementId: string): Promise<Agreement> => {
  try {
    const { data, error } = await supabase
      .from('agreements')
      .select('*')
      .eq('id', agreementId)
      .single();
    
    if (error) throw error;
    return data as Agreement;
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error(`Error fetching agreement ${agreementId}:`, error);
    captureException(error, { context: 'fetchAgreementById', agreementId });
    throw error;
  }
};

// Prefetch function to be used outside the hook
export const prefetchAgreement = (queryClient: QueryClient, agreementId: string) => {
  return queryClient.prefetchQuery({
    queryKey: ['agreement', agreementId],
    queryFn: () => fetchAgreementById(agreementId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Prefetch function for agreements list
export const prefetchAgreements = (queryClient: QueryClient, userId?: string) => {
  return queryClient.prefetchQuery({
    queryKey: ['agreements', userId],
    queryFn: () => fetchAgreements(userId),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export function useAgreements(userId?: string) {
  const [error, setError] = useState<Error | null>(null);
  const queryClient = useQueryClient();

  const { data: agreements, isLoading, refetch, isError, error: queryError } = useQuery<Agreement[], Error>({
    queryKey: ['agreements', userId],
    queryFn: () => fetchAgreements(userId),
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const resetError = useCallback(() => {
    setError(null);
  }, []);
  
  // Function to fetch a single agreement
  const useAgreementById = (agreementId: string) => {
    return useQuery<Agreement, Error>({
      queryKey: ['agreement', agreementId],
      queryFn: () => fetchAgreementById(agreementId),
      enabled: !!agreementId,
      staleTime: 5 * 60 * 1000 // 5 minutes
    });
  };
  
  // Function to prefetch an agreement on hover
  const prefetchAgreementOnHover = useCallback((agreementId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['agreement', agreementId],
      queryFn: () => fetchAgreementById(agreementId),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  }, [queryClient]);

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

  // Update error state when query error changes
  useEffect(() => {
    if (queryError) {
      setError(queryError);
    }
  }, [queryError]);

  return {
    agreements,
    isLoading,
    isError,
    error,
    resetError,
    refetch,
    uploadAgreement,
    downloadAgreement,
    useAgreementById,
    prefetchAgreementOnHover,
  };
}
