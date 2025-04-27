
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PhysicalAgreementUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [signedDate, setSignedDate] = useState('');
  const { user } = useAuth();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user || !title || !signedDate) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/agreements/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('agent-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('physical_agreements')
        .insert({
          user_id: user.id,
          title,
          file_path: filePath,
          signed_date: signedDate,
        });

      if (dbError) throw dbError;
      
      toast.success('Agreement uploaded successfully');
      setTitle('');
      setSignedDate('');
    } catch (error: any) {
      toast.error(error.message || 'Error uploading agreement');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="agreement-title">Agreement Title</Label>
        <Input
          id="agreement-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter agreement title"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signed-date">Date Signed</Label>
        <Input
          id="signed-date"
          type="date"
          value={signedDate}
          onChange={(e) => setSignedDate(e.target.value)}
        />
      </div>

      <input
        type="file"
        id="agreement-upload"
        className="hidden"
        onChange={handleFileUpload}
        accept=".pdf,.doc,.docx"
      />
      <label htmlFor="agreement-upload">
        <Button
          variant="outline"
          className="w-full"
          disabled={isUploading}
          asChild
        >
          <span>
            <FileText className="mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Executed Agreement'}
          </span>
        </Button>
      </label>
    </div>
  );
}
