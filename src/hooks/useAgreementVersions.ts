import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AgreementVersion {
  id: string;
  agreement_id: string;
  version_number: number;
  file_path: string;
  file_size: number;
  created_by: string;
  created_at: string;
  changes_summary: string;
  metadata: Record<string, any>;
}

interface CreateVersionParams {
  agreementId: string;
  file: File;
  changesSummary: string;
  metadata?: Record<string, any>;
}

export function useAgreementVersions(agreementId?: string) {
  const queryClient = useQueryClient();

  const { data: versions, isLoading } = useQuery({
    queryKey: ['agreement-versions', agreementId],
    queryFn: async () => {
      if (!agreementId) return [];
      
      const { data, error } = await supabase
        .from('agreement_versions')
        .select(`
          id,
          agreement_id,
          version_number,
          file_path,
          file_size,
          created_by,
          created_at,
          changes_summary,
          metadata
        `)
        .eq('agreement_id', agreementId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      return data as AgreementVersion[];
    },
    enabled: !!agreementId,
  });

  const createVersion = useMutation({
    mutationFn: async ({ agreementId, file, changesSummary, metadata = {} }: CreateVersionParams) => {
      // 1. Get the latest version number
      const { data: latestVersion, error: versionError } = await supabase
        .from('agreement_versions')
        .select('version_number')
        .eq('agreement_id', agreementId)
        .order('version_number', { ascending: false })
        .limit(1)
        .single();

      if (versionError) throw versionError;

      const newVersionNumber = (latestVersion?.version_number || 0) + 1;
      const filePath = `${agreementId}/v${newVersionNumber}/${file.name}`;

      // 2. Upload the file
      const { error: uploadError } = await supabase.storage
        .from('agreements')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 3. Create version record
      const { data, error: insertError } = await supabase
        .from('agreement_versions')
        .insert({
          agreement_id: agreementId,
          version_number: newVersionNumber,
          file_path: filePath,
          file_size: file.size,
          changes_summary: changesSummary,
          metadata,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agreement-versions', agreementId] });
    },
  });

  const getVersionDownloadUrl = async (version: AgreementVersion) => {
    const { data } = await supabase.storage
      .from('agreements')
      .createSignedUrl(version.file_path, 3600); // 1 hour expiry

    return data?.signedUrl;
  };

  const compareVersions = async (version1: AgreementVersion, version2: AgreementVersion) => {
    // Get download URLs for both versions
    const [url1, url2] = await Promise.all([
      getVersionDownloadUrl(version1),
      getVersionDownloadUrl(version2),
    ]);

    // Return URLs for the comparison view
    return {
      oldVersion: {
        url: url1,
        versionNumber: version1.version_number,
        createdAt: version1.created_at,
      },
      newVersion: {
        url: url2,
        versionNumber: version2.version_number,
        createdAt: version2.created_at,
      },
    };
  };

  return {
    versions,
    isLoading,
    createVersion,
    getVersionDownloadUrl,
    compareVersions,
  };
}
