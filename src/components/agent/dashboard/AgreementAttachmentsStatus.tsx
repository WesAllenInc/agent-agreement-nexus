import { useEffect, useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAgreementAttachments } from "@/hooks/useAgreementAttachments";
import { FileText, AlertCircle, CheckCircle2, ExternalLink, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { captureException } from "@/utils/errorTracking";
import { Loading } from "@/components/ui/loading";
import { ErrorMessage } from "@/components/ui/error-message";

interface AgreementAttachmentsStatusProps {
  className?: string;
}

export default function AgreementAttachmentsStatus({ className }: AgreementAttachmentsStatusProps) {
  const [agreementId, setAgreementId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { attachments, fetchAttachments, loading: attachmentsLoading } = useAgreementAttachments({ 
    agreementId: agreementId || "" 
  });

  // Fetch the user's active agreement
  const fetchUserAgreement = useCallback(async (showRefresh = false) => {
    if (!user?.id) return;
    
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      // First check for signatures in the agreement_signatures table
      const { data: signatureData, error: signatureError } = await supabase
        .from("agreement_signatures")
        .select("agreement_id")
        .eq("user_id", user.id)
        .order("signed_at", { ascending: false })
        .limit(1);

      if (signatureError) {
        captureException(signatureError, { context: "Fetching agreement signatures" });
        throw new Error(`Error fetching signature: ${signatureError.message}`);
      }

      // If we found a signature, use that agreement
      if (signatureData && signatureData.length > 0) {
        setAgreementId(signatureData[0].agreement_id);
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

      if (error && error.code !== "PGRST116") { // PGRST116 is the "no rows returned" error
        captureException(error, { context: "Fetching signed agreements" });
        throw new Error(`Error fetching agreement: ${error.message}`);
      }

      if (data) {
        setAgreementId(data.id);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch agreement data";
      setError(errorMessage);
      captureException(error, { context: "AgreementAttachmentsStatus" });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  // Initial fetch
  useEffect(() => {
    fetchUserAgreement();
  }, [fetchUserAgreement]);

  // Fetch attachments when agreement ID is available
  useEffect(() => {
    if (agreementId) {
      fetchAttachments().catch(err => {
        captureException(err, { context: "Fetching agreement attachments" });
        setError("Failed to load attachments. Please try again.");
      });
    }
  }, [agreementId, fetchAttachments]);

  // Memoize attachment status to prevent unnecessary re-renders
  const { hasScheduleB, hasScheduleC } = useMemo(() => ({
    hasScheduleB: attachments.some(attachment => attachment.type === "B"),
    hasScheduleC: attachments.some(attachment => attachment.type === "C")
  }), [attachments]);

  // Navigate to agreement details
  const handleViewAgreement = useCallback(() => {
    if (agreementId) {
      navigate(`/agreements/${agreementId}`);
    }
  }, [agreementId, navigate]);
  
  // Handle manual refresh
  const handleRefresh = useCallback(() => {
    fetchUserAgreement(true);
  }, [fetchUserAgreement]);

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Agreement Attachments</CardTitle>
          <CardDescription>Loading your agreement information...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <Loading size={32} />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Agreement Attachments</CardTitle>
          <CardDescription>There was a problem loading your agreement</CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorMessage message={error} />
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            className="w-full mt-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!agreementId) {
    return (
      <Card className={className}>
        <CardHeader className="sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Agreement Attachments</CardTitle>
            <CardDescription>You need to sign an agreement first</CardDescription>
          </div>
          {refreshing ? (
            <Button variant="ghost" size="sm" disabled>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Refreshing...
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={handleRefresh} className="hidden sm:flex">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Agreement Found</AlertTitle>
            <AlertDescription>
              You need to sign your agent agreement before you can upload attachments.
            </AlertDescription>
          </Alert>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh} 
            className="w-full mt-4 sm:hidden"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Agreement Attachments</CardTitle>
          <CardDescription>Required documents for your agent agreement</CardDescription>
        </div>
        {refreshing ? (
          <Button variant="ghost" size="sm" disabled>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Refreshing...
          </Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={handleRefresh} className="hidden sm:flex">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {attachmentsLoading ? (
          <div className="flex justify-center py-4">
            <Loading size={24} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-md bg-gray-50">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-medium">Schedule B</p>
                  <p className="text-sm text-muted-foreground">Commission Schedule</p>
                </div>
              </div>
              <div className="ml-7 sm:ml-0 mt-2 sm:mt-0">
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

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-md bg-gray-50">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-medium">Schedule C</p>
                  <p className="text-sm text-muted-foreground">Additional Terms</p>
                </div>
              </div>
              <div className="ml-7 sm:ml-0 mt-2 sm:mt-0">
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
        )}

        <Button 
          onClick={handleViewAgreement} 
          className="w-full mt-4"
          variant="outline"
          disabled={attachmentsLoading || !agreementId}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View Agreement & Manage Attachments
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh} 
          className="w-full mt-2 sm:hidden"
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </CardContent>
    </Card>
  );
}
