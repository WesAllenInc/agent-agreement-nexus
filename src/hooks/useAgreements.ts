import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Agreement {
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
    mutationFn: async ({ file, userId }: { file: File; userId: string }) => {
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
    onError: (error) => {
      toast({
        title: 'Error',
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
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download agreement',
        variant: 'destructive',
      });
    }
  };

  return {
    agreements,
    isLoading,
    uploadAgreement,
    downloadAgreement,
  };
}
