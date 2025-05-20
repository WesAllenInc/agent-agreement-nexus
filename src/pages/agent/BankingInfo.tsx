import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import MainLayout from "@/components/layout/MainLayout";
import AchInfoForm from "@/components/onboarding/AchInfoForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, CheckCircle, Edit } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AchInfo {
  id: string;
  bank_name: string;
  masked_account_number: string;
  routing_number: string;
  created_at: string;
  updated_at: string;
}

export default function BankingInfo() {
  const [loading, setLoading] = useState(true);
  const [hasAchInfo, setHasAchInfo] = useState(false);
  const [achInfo, setAchInfo] = useState<AchInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isApprovedAgent, setIsApprovedAgent] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user) return;

      try {
        // Check if user is an approved agent
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role, status")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        // Only allow access if user is an agent with approved status
        const isApproved = 
          profileData.role === "agent" && 
          profileData.status === "active";
        
        setIsApprovedAgent(isApproved);

        if (!isApproved) {
          // Redirect non-approved users
          navigate("/pending-approval");
          return;
        }

        // Check if user already has ACH info
        const { data, error } = await supabase
          .from("ach_info_masked")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 is "no rows returned" error, which is expected if no ACH info exists
          throw error;
        }

        if (data) {
          setAchInfo(data);
          setHasAchInfo(true);
        }
      } catch (error) {
        console.error("Error fetching banking info:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, [user, navigate]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
          <span className="ml-2 text-lg text-gray-600">Loading...</span>
        </div>
      </MainLayout>
    );
  }

  if (!isApprovedAgent) {
    return null; // Will redirect in useEffect
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Banking Information</h1>
          <p className="text-gray-600 mt-2">
            Manage your ACH information for commission payments
          </p>
        </div>

        {hasAchInfo && !isEditing ? (
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Banking Information</CardTitle>
                <CardDescription>
                  This information will be used for commission payments
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(true)}
                className="flex items-center"
              >
                <Edit className="mr-2 h-4 w-4" />
                Update
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Bank Name</h3>
                  <p className="mt-1 text-lg">{achInfo?.bank_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Routing Number</h3>
                  <p className="mt-1 text-lg">{achInfo?.routing_number}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Account Number</h3>
                  <p className="mt-1 text-lg">{achInfo?.masked_account_number}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                  <p className="mt-1 text-lg">
                    {achInfo?.updated_at
                      ? new Date(achInfo.updated_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200 mt-6">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">Information Verified</AlertTitle>
                <AlertDescription className="text-blue-700">
                  Your banking information has been securely stored and is ready for commission payments.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-md mx-auto">
            {hasAchInfo && isEditing && (
              <Alert className="bg-yellow-50 border-yellow-200 mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Updating Banking Information</AlertTitle>
                <AlertDescription>
                  You are updating your existing banking information. This will replace your current details.
                </AlertDescription>
              </Alert>
            )}
            <AchInfoForm />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
