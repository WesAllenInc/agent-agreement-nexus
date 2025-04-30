
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import AgreementTimeline from "@/components/admin/agreement/AgreementTimeline";
import AgreementMetadata from "@/components/admin/agreement/AgreementMetadata";
import AgreementContent from "@/components/admin/agreement/AgreementContent";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function AgreementDetails() {
  const { id } = useParams<{ id: string }>();

  const { data: agreement, isLoading } = useQuery({
    queryKey: ['agreement', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('executed_agreements')
        .select('*, profiles(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <MainLayout isAdmin>
        <div className="animate-pulse">
          <div className="h-8 w-1/3 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </MainLayout>
    );
  }

  if (!agreement) {
    return (
      <MainLayout isAdmin>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900">Agreement not found</h2>
          <p className="mt-2 text-gray-600">The agreement you're looking for doesn't exist or you don't have permission to view it.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout isAdmin>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Agreement Details</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AgreementContent agreement={agreement} />
          </div>
          <div className="space-y-6">
            <AgreementMetadata agreement={agreement} />
            <AgreementTimeline agreement={agreement} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

