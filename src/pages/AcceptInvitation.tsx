import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AcceptInvitationForm from "@/components/auth/AcceptInvitationForm";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function AcceptInvitation() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
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
        
        const { data, error } = await supabase.functions.invoke('validateToken', {
          body: { token: tokenParam, email: emailParam }
        });

        console.log("Debug: Validation response:", { data, error });
        
        if (error || !data?.valid) {
          toast.error(error?.message || data?.error || "This invitation link has expired or is invalid");
          setIsValidating(false);
          return;
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

  const renderContent = () => {
    if (isValidating) {
      return (
        <Card className="w-[400px] shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Validating Invitation</CardTitle>
            <CardDescription className="text-center">Please wait...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      );
    }

    if (!isValid) {
      return (
        <Card className="w-[400px] shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Invalid Invitation</CardTitle>
            <CardDescription className="text-center">
              This invitation link has expired or is invalid. Please request a new invitation.
            </CardDescription>
          </CardHeader>
        </Card>
      );
    }

    return <AcceptInvitationForm email={email} token={token} />;
  };

  return (
    <AnimatedBackground>
      <AnimatePresence mode="wait">
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
