
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Download, FileText } from "lucide-react";

export default function DocumentDownload() {
  const { user } = useAuth();
  
  const { data: agreements, isLoading } = useQuery({
    queryKey: ['signed-agreements'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('executed_agreements')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'signed')
        .order('signed_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const handleDownloadPDF = (agreementId: string, title: string) => {
    // This would normally connect to a PDF generation service
    // For now, we'll just show an alert
    alert(`Downloading PDF for agreement: ${title}`);
    
    // In a real implementation, you would use:
    // 1. A pre-generated PDF stored in Supabase Storage
    // 2. Or an edge function that generates a PDF on-demand
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Executed Agreements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            Loading agreements...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!agreements || agreements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Executed Agreements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 opacity-50 mb-2" />
            <p>No signed agreements found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Executed Agreements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {agreements.map((agreement) => (
            <div 
              key={agreement.id} 
              className="flex items-center justify-between p-3 border rounded-md"
            >
              <div>
                <h4 className="font-medium">{agreement.title}</h4>
                <p className="text-sm text-muted-foreground">
                  Signed: {new Date(agreement.signed_at).toLocaleDateString()}
                </p>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleDownloadPDF(agreement.id, agreement.title)}
              >
                <Download className="h-4 w-4 mr-1" /> Download PDF
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
