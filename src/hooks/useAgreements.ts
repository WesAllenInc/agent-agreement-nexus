import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../components/ui/use-toast';
import { Agreement, UploadAgreementParams, ExecuteAgreementParams } from '../types/agreement';

export function useAgreements(userId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: agreements, isLoading } = useQuery({
    queryKey: ['agreements', userId],
    queryFn: async () => {
      let query = supabase.from('agreements').select('*');
      if (userId) {
        query = query.eq('user_id', userId);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data as Agreement[];
    },
  });

  const uploadAgreement = useMutation({
    mutationFn: async ({ file, userId }: UploadAgreementParams) => {
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agreements'] });
      toast({
        title: 'Success',
        description: 'Agreement uploaded successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const executeAgreement = useMutation({
    mutationFn: async ({ agreementId, agentName, agentEmail, signatureData }: ExecuteAgreementParams) => {
      // Get the current timestamp
      const executedAt = new Date().toISOString();
      
      // Update the agreement record with execution details
      const { error } = await supabase
        .from('agreements')
        .update({
          status: 'executed',
          executed_at: executedAt,
          executed_by: userId,
          signature_data: signatureData,
          agent_name: agentName,
          agent_email: agentEmail,
        })
        .eq('id', agreementId);
      
      if (error) throw error;
      
      return { agreementId, executedAt };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agreements'] });
      toast({
        title: 'Agreement Executed',
        description: 'Sales agent agreement has been successfully executed',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Execution Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const downloadAgreement = async (agreement: Agreement) => {
    try {
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

      toast({
        title: 'Success',
        description: 'Agreement downloaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to download agreement',
        variant: 'destructive',
      });
    }
  };

  return {
    agreements,
    isLoading,
    uploadAgreement,
    executeAgreement,
    downloadAgreement,
  };
}
