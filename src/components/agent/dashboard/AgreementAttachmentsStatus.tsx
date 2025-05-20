import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAgreementAttachments } from "@/hooks/useAgreementAttachments";
import { FileText, AlertCircle, CheckCircle2, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface AgreementAttachmentsStatusProps {
  className?: string;
}

export default function AgreementAttachmentsStatus({ className }: AgreementAttachmentsStatusProps) {
  const [agreementId, setAgreementId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { attachments, fetchAttachments } = useAgreementAttachments({ 
    agreementId: agreementId || "" 
  });

  // Fetch the user's active agreement
  useEffect(() => {
    const fetchUserAgreement = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        // First check for signatures in the agreement_signatures table
        const { data: signatureData, error: signatureError } = await supabase
          .from("agreement_signatures")
          .select("agreement_id")
          .eq("user_id", user.id)
          .order("signed_at", { ascending: false })
          .limit(1);

        if (signatureError) {
          console.error("Error fetching signature:", signatureError);
        }

        // If we found a signature, use that agreement
        if (signatureData && signatureData.length > 0) {
          setAgreementId(signatureData[0].agreement_id);
          setLoading(false);
          return;
        }
        
        // As a fallback, check for agreements marked as signed
        const { data, error } = await supabase
          .from("agreements")
          .select("id, status")
          .eq("user_id", user.id)
          .eq("status", "signed")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error("Error fetching agreement:", error);
          return;
        }

        if (data) {
          setAgreementId(data.id);
        }
      } catch (error) {
        console.error("Error in fetchUserAgreement:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAgreement();
  }, [user?.id]);

  // Fetch attachments when agreement ID is available
  useEffect(() => {
    if (agreementId) {
      fetchAttachments();
    }
  }, [agreementId, fetchAttachments]);

  const hasScheduleB = attachments.some(attachment => attachment.type === "B");
  const hasScheduleC = attachments.some(attachment => attachment.type === "C");

  const handleViewAgreement = () => {
    if (agreementId) {
      navigate(`/agreements/${agreementId}`);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Agreement Attachments</CardTitle>
          <CardDescription>Loading your agreement information...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <div className="animate-pulse space-y-4 w-full">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!agreementId) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Agreement Attachments</CardTitle>
          <CardDescription>You need to sign an agreement first</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You need to sign your agent agreement before you can upload attachments.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Agreement Attachments</CardTitle>
        <CardDescription>Required documents for your agent agreement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Schedule B</p>
                <p className="text-sm text-muted-foreground">Commission Schedule</p>
              </div>
            </div>
            <div>
              {hasScheduleB ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Uploaded</span>
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  Required
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Schedule C</p>
                <p className="text-sm text-muted-foreground">Additional Terms</p>
              </div>
            </div>
            <div>
              {hasScheduleC ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Uploaded</span>
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  Required
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Button 
          onClick={handleViewAgreement} 
          className="w-full mt-4"
          variant="outline"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View Agreement & Manage Attachments
        </Button>
      </CardContent>
    </Card>
  );
}
