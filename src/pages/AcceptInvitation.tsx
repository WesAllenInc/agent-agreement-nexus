import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AcceptInvitationForm from "@/components/auth/AcceptInvitationForm";
import { toast } from "sonner";
import { validateToken } from "@/api/mockEdgeFunctions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function AcceptInvitation() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
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
        const result = await validateToken(tokenParam, emailParam);
        
        if (!result.valid) {
          toast.error(result.error || "This invitation link has expired or is invalid");
          setIsValidating(false);
          return;
        }
        
        setIsValid(true);
        setIsValidating(false);
      } catch (error: any) {
        toast.error("Error validating invitation: " + (error.message || "Please try again"));
        setIsValidating(false);
      }
    };
    
    checkToken();
  }, [location.search]);

  const renderContent = () => {
    if (isValidating) {
      return (
        <div className="text-center p-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg font-medium text-gray-600">Validating invitation...</p>
        </div>
      );
    }
    
    if (!isValid) {
      return (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Invalid Invitation</h2>
          <p className="text-gray-600">
            This invitation link is invalid or has expired.
          </p>
          <button
            className="text-primary hover:text-primary-600 font-medium transition-colors"
            onClick={() => navigate("/auth")}
          >
            Go to Login
          </button>
        </div>
      );
    }

    return <AcceptInvitationForm token={token} email={email} />;
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 via-transparent to-primary-600/20 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md mx-auto p-6"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <img 
              src="/lovable-uploads/692c0e22-35ce-4558-9822-df60e105764d.png" 
              alt="Ireland Pay Logo" 
              className="h-24 mb-4 drop-shadow-lg"
            />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-primary-800"
          >
            Welcome to Ireland Pay
          </motion.h1>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 border-primary-100/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary-800">
              Accept Invitation
            </CardTitle>
            <CardDescription>
              Create your account to get started with Ireland Pay
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
