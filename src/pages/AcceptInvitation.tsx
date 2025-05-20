import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AcceptInvitationForm from "@/components/auth/AcceptInvitationForm";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AcceptInvitation() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [invitationData, setInvitationData] = useState<{
    residualPercent?: number;
    expiresAt?: string;
    metadata?: Record<string, any>;
  }>({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract token and email from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get("token");
    const emailParam = queryParams.get("email");
    
    if (!tokenParam || !emailParam) {
      toast.error("Invalid invitation link");
      setIsValidating(false);
      return;
    }
    
    setToken(tokenParam);
    setEmail(emailParam);
    
    const checkToken = async () => {
      try {
        console.log("Debug: Validating token...", { token: tokenParam, email: emailParam });
        
        // First validate the token
        const { data, error } = await supabase.functions.invoke('validateToken', {
          body: { token: tokenParam, email: emailParam }
        });
        
        // If token is valid, fetch the invitation details
        if (data?.valid && !error) {
          const { data: invitationData, error: invitationError } = await supabase
            .from('invitations')
            .select('residual_percent, expires_at, metadata')
            .eq('token', tokenParam)
            .eq('email', emailParam)
            .single();
            
          if (!invitationError && invitationData) {
            setInvitationData({
              residualPercent: invitationData.residual_percent,
              expiresAt: invitationData.expires_at,
              metadata: invitationData.metadata || {}
            });
            console.log("Debug: Invitation data fetched:", invitationData);
          } else {
            console.error("Debug: Error fetching invitation details:", invitationError);
            throw new Error("Could not retrieve invitation details");
          }
        } else {
          throw new Error(error?.message || data?.error || "This invitation link has expired or is invalid");
        }
        
        setIsValid(true);
        setIsValidating(false);
      } catch (error) {
        console.error("Debug: Token validation error:", error);
        const errorMessage = error instanceof Error ? error.message : "Please try again";
        toast.error("Error validating invitation: " + errorMessage);
        setIsValidating(false);
      }
    };
    
    checkToken();
  }, [location.search, navigate]);

  const formatExpiryDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  const renderContent = () => {
    if (isValidating) {
      return (
        <Card className="w-[450px] shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Validating Invitation</CardTitle>
            <CardDescription className="text-center">Please wait while we verify your invitation...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      );
    }

    if (!isValid) {
      return (
        <Card className="w-[450px] shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Invalid Invitation</CardTitle>
            <CardDescription className="text-center">
              This invitation link has expired or is invalid. Please request a new invitation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Invitation Error</AlertTitle>
              <AlertDescription>
                The invitation link you're trying to use is no longer valid. This could be because:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>The invitation has expired</li>
                  <li>The invitation has already been used</li>
                  <li>The invitation was canceled</li>
                </ul>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      );
    }

    return (
      <>
        <Card className="w-[450px] shadow-lg mb-4">
          <CardHeader>
            <CardTitle className="text-center">Accept Your Invitation</CardTitle>
            <CardDescription className="text-center">
              You've been invited to join Agent Agreement Nexus as an agent with a {invitationData.residualPercent}% residual.
              <p className="mt-2 text-sm text-amber-600">
                This invitation expires on {formatExpiryDate(invitationData.expiresAt)}
              </p>
            </CardDescription>
          </CardHeader>
        </Card>
        <AcceptInvitationForm 
          email={email} 
          token={token} 
          residualPercent={invitationData.residualPercent} 
          metadata={invitationData.metadata} 
        />
      </>
    );
  };

  return (
    <AnimatedBackground>
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={isValidating ? 'validating' : isValid ? 'valid' : 'invalid'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </AnimatedBackground>
  );
}

